/**
 * IPFS movies interface
 */

const log = require('logplease').create('CORE')
const Node = require('./node')
const Ingest = require('./ingest')
const BroadCast = require('./broadcast')

module.exports = (ipcMain, runtime = 'node') => {
  let nodeConf = { broker: BroadCast }
  const isWebRuntime = runtime === 'web'
  if (!isWebRuntime) {
    const { ROOT_ORBIT_DIR } = require('./settings')
    nodeConf = Object.assign({ directory: ROOT_ORBIT_DIR }, nodeConf)
  }

  const orbit = Node.getInstance({ orbit: nodeConf })
  const ingest = Ingest.getInstance(orbit)

  const initEvents = (e) => {
    /***
     * Initialize events for orbit and ingesting process
     * @param {object} e ipcMain
     */
    // Remove listener before add new
    orbit.removeAllListeners()
    ingest.removeAllListeners()

    // Orbit node listeners
    orbit.on('node-error', (m) => e.reply('node-error', m))
    orbit.on('node-peer', (peerSize) => e.reply('node-peer', peerSize))
    orbit.on('node-chaos', () => {
      // Stop queue processor
      ingest.cleanInterval()
      ipcMain.emit('party')
    })

    orbit.on('node-raised', async () => {
      // Node raised and ready to work with it
      ipcMain.on('node-broadcast', (e, message) => {
        // On new message broadcast message
        orbit.pubsub.broadcast(message)
      })
    })

    // Ingest process listener
    ingest.on('ingest-step', (step) => e.reply('node-step', step))
    ingest.on('ingest-replicated', (c, s, t) => e.reply('node-replicated', c, s, t))

    // On party success ready then logout
    ipcMain.removeAllListeners('party-success')
    ipcMain.on('party-success', () => {
      log.warn('Party success')
      e.reply('node-chaos')
    })
  }

  ipcMain.on('node-start', async (e) => {
    initEvents(e) // Init listener on node ready
    // Node events to handle progress and ready state
    // "node-step" handle event to keep tracking states of node
    orbit.on('node-progress', (_, hash) => setImmediate(() => { orbit.queue = hash }))
      .on('node-step', (step) => e.reply('node-step', step))
      .on('node-loaded', () => e.reply('node-loaded'))
      .on('node-ready', () => {
        // FIFO queue processing
        ingest.queueProcessor()
        e.reply('node-ready')
      })

    log.info('Start orbit..')
    await orbit.start(e)
  })

  ipcMain.on('node-seed', async (e) => {
    initEvents(e)
    log.info('Starting seed')
    orbit.setInSeedMode(true)
    await orbit.start()
  })

  ipcMain.on('online-status-changed', async (e, isOnline) => {
    log.info('Going ' + (isOnline ? 'online' : 'offline'))
    if (!isOnline) await orbit.close()
    if (isOnline) await orbit.start()
  })

  ipcMain.on('node-close', async () => {
    log.warn('Closing orbit')
    await orbit.close()
  })

  ipcMain.on('node-flush', async () => {
    log.warn('Flushing orbit')
    ingest.cleanInterval()
    await orbit.party('Logout')
  })

  return {
    closed: () => orbit.closed,
    close: async () => {
      try {
        ingest.cleanInterval()
        await orbit.close()
      } catch (e) {
        log.error('Error trying close node')
      }
    }
  }
}
