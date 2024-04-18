const Key = require('../key')
const EventEmitter = require('events')
const logplease = require('logplease')
const log = logplease.create('BROKER', { color: logplease.Colors.Yellow })

const Engine = Key.engine
const LinvoDB = require('linvodb3')

LinvoDB.dbPath = Key.init.db
LinvoDB.defaults.store = { db: Engine }
LinvoDB.defaults.autoIndexing = false
log.info(`Using ${Engine.name}`)

// ipcRender listeners
const DB = 'wt'

const IPC_LISTENERS = [
  'node-chaos',
  'node-peer',
  'node-error',
  'node-ready',
  'node-ready',
  'node-loaded',
  'node-progress',
  'node-replicated'
]

// Capture unhandled exceptions
process?.on('uncaughtException', (e) => {
  log.warn(e)
  log.warn('Uncaught Exception: keeping process alive')
})

module.exports = class Broker extends EventEmitter {
  constructor (renderer) {
    super()

    this.db = null
    this.renderer = renderer
    this.initStore()
  }

  initStore () {
    log.warn('Creating local db')
    if (this.db) return this.db
    this.db = new LinvoDB(DB)
  }

  flush () {

    this.db.remove({}, { multi: true },
      (err, numRemoved) => {
        if (err) log.error(err)
        log.info('Flushed db entries: ', numRemoved)
        this.renderer.send('node-flush')
      })
  }

  getIPC () {
    // Inter process handler
    return this.renderer
  }

  stopIpcEvents (ipcListeners = []) {
    const listeners = ipcListeners.length
      ? ipcListeners
      : IPC_LISTENERS;

    (listeners).forEach((l) => {
      log.info('Cleaning:', l)
      this.renderer.removeAllListeners(l)
    })

    return this
  }

  startSeed () {
    log.info('Run Seed')
    this.renderer.send('node-seed')
    return this
  }

  emitStart () {
    this.renderer.send('node-start')
    return this
  }

  broadcastMessage (message) {
    this.renderer.send('node-broadcast', message)
    return this
  }

  listenForNewPeer () {
    this.renderer.on('node-peer', (e, p) => {
      log.info('New peer', p)
      Key.addToStorage({ peers: p })
      this.emit('peer', p)
    })
  }

  listenForPartyRock () {
    this.renderer.on('node-chaos', (e, m) => {
      this.emit('chaos', m)
    })
  }

  listenForError () {
    this.renderer.on('node-error', (e, m) => {
      this.emit('error', m)
    })
  }

  listenForReady () {
    this.renderer.on('node-ready', (e, c) => {
      this.emit('start', c)
    })
  }

  listenForDbLoaded () {
    this.renderer.on('node-loaded', (e, c) => {
      this.emit('done', c)
    })
  }

  listenForReplicaProgress () {
    this.renderer.on('node-step', (e, step) => {
      this.emit('progress', step)
    })
  }

  listenForReplicatedData () {
    this.renderer.on('node-replicated', async (e, collection) => {
      log.info('LOADING FROM NETWORK')
      log.info(collection[collection.length - 1]._id)
      log.info(collection[0]._id) // get id for ingested chunk
      const total = this.db.getAllData().length
      const firstChunk = Object.is(total, 0)
      this.db.insert(collection, (e, n) => {
        if (e) return // Avoid `n.length` undefined
        if (firstChunk) {
          log.warn('First chunk inserted')
          this.emit('ready')
        }

        log.info(`Inserted: ${n?.length || 0}`)
        log.info('Total:', total + n.length)
      }) // Save in local
      this.emit('replicated')
    })
  }

  load () {
    // Clean old listeners first
    log.info('Broker ready')
    this.stopIpcEvents()
    this.emitStart()
    this.listenForPartyRock()
    this.listenForNewPeer()
    this.listenForError()
    this.listenForReady()
    this.listenForDbLoaded()
    this.listenForReplicaProgress()
    this.listenForReplicatedData()
  }
}
