const IPFS = require('ipfs')
const log = require('logplease').create('IPFS')
const libp2p = require('./p2p')
const defaultConf = require('./settings')

const ipfsFactory = async (conf = {}) => {
  // Ipfs factory
  const confSettings = defaultConf()
  const isInstance = await IPFS.create({
    ...{
      config: confSettings,
      preload: { enabled: false },
      EXPERIMENTAL: { pubsub: true },
      ...{ libp2p }
    },
    ...conf
  })

  try {
    await isInstance.start()
    const ipfsID = await isInstance.id()
    isInstance.kill = async () => isInstance.stop() // Alias to stop
    isInstance.peerId = ipfsID // Add virtual attr needed for broadcasting

    // Direct dialing to nodes
    await Promise.all(confSettings.Bootstrap.map(async (p) => {
      log.info('Dialing to ', p) // Log for dialed peers
      return await isInstance.swarm.connect(p).catch(() => log.warn('Fail dialing', p))
    })).catch(() => log.error('Fail dialing to workers'))

    log.info('Dial done')
    log.info('Running ipfs id', ipfsID.id)
    return isInstance
  } catch (e) {
    await isInstance.stop().catch(() => log.error('Error trying to stop node'))
    log.error('Fail on start: cleanup node')
    return false
  }
}

module.exports = {
  start: ipfsFactory
}
