const { CID } = require('ipfs-http-client')
const EventEmitter = require('events')
const OrbitDB = require('orbit-db')
const last = require('it-last')
const { base58btc } = require('multiformats/bases/base58')

const provider = require('./provs')
const ipfs = require('./ipfs')
const key = require('./key')
const log = require('logplease')
  .create('NODE')

const DEFAULT_HOLD = 10 * 1000

module.exports = class Node extends EventEmitter {
  constructor (conf = {}) {
    super()
    this.conf = conf
    this.seedMode = false
    this.peers = new Set()
    this.ready = false
    this.closed = false //
    this.orbit = null // Orbit db instance
    this.node = null // Running node instance
    this.db = null // Current opened db
  }

  get [Symbol.toStringTag] () {
    return 'Node'
  }

  static getInstance (conf) {
    return new Node(conf)
  }

  /**
   * Open new orbit channel
   *
   * @param {*} address
   * @param {*} [settings={}]
   * @return {*}
   */
  open (address, settings = {}) {
    return this.orbit.open(address, {
      ...{
        replicate: true,
        overwrite: true
      },
      ...settings
    }
    )
  }

  /**
   * Set node in seed mode
   * this state avoid close/destroy the nodXe
   * id this state is true then the node keep running to provide data to network
   *
   * @param {boolean} [isRunningSeed=false]
   */
  setInSeedMode (isRunningSeed = false) {
    this.seedMode = isRunningSeed
  }

  async getIngestKey () {
    return this.resolveKey(
      this.rawIngestKey
    )
  }

  sanitizeKey (address) {
    return key.sanitizedKey(address)
  }

  get rawIngestKey () {
    return key.getIngestKey()
  }

  get hasValidCache () {
    const [validCache] = this.cache
    return validCache
  }

  get cache () {
    const cache = key.readFromStorage()
    const validCache = cache && 'tmp' in cache
    return [validCache, cache]
  }

  // async waitForPeers() {
  //     // If not peers available recursive call until peers available
  //     const currentPeers = await this.node?.swarm.peers()
  //     if (!currentPeers.length) {
  //         log.warn('Waiting for peers')
  //         return await this.waitForPeers()
  //     }
  //
  //     log.info('Peers connected:', currentPeers.length)
  //     return Promise.resolve()
  // }

  /**
   * Resolve ipns key if needed
   * @param ipns {string} IPNS hash
   * @return {string} Orbit address resolver key from ipns
   */
  async resolveKey (ipns) {
    if (!ipns) return false
    if (~ipns.indexOf('zd')) return ipns

    try {
      // await this.waitForPeers();
      this.emit('node-step', 'Resolving')
      const cid = await last(this.node.name.resolve(ipns))
      const cleanedCID = cid.split('/').pop()
      const newCID = CID.parse(cleanedCID)
      return newCID.toString(base58btc)
    } catch (e) {
      // Avoid using invalid keys
      if (!this.seedMode) {
        await this.party('Network Error')
      }
      return false
    }
  }

  /**
   * Open orbit address and set events listeners
   * @param key: orbit address
   * @param res: callback
   */
  async run (key, res) {
    log.info('Starting movies db:', key)
    this.db = await this.open(key).catch(async (e) => {
      console.log(e)
      // If db cannot be opened then just kill
      log.error(`Error opening db ${key}`)
      // this.emit('node-step', 'Retrying')
      // this.ready = false;
      // await this.start() // Retrying
    })

    this.db?.events?.on('peer', (p) => {
      log.info('Peer:', p)
      this.peers.add(p) // Add new peer to list
      this.emit('node-peer', this.peers.size)
    })

    if (this.db && !this.closed) { // Check if db set
      this.ready = true
      log.info(`Ready in orbit ${key}`)
      this.emit('node-step', 'Replicating')
      this.emit('node-ready')
    }

    this.db?.events?.on('ready', () => this.emit('node-loaded'))
    this.db?.events?.on('replicated', (address, t) => this.emit('node-replicated', address, t))
    this.db?.events?.on('replicate.progress', (address, hash, entry, progress, have) => {
      this.emit('node-progress', address, hash, entry, progress, have)
    })

    res(this.db)
  }

  /**
   * Kill all - party all
   */
  async party (msg = 'Invalid Key') {
    log.warn('Party rock')
    this.emit('node-chaos', msg)
    await this.close(true)
  }

  get pubsub () {
    if (!this.orbit) return {}
    return this.orbit._pubsub
  }

  /**
   * Get orbit node ready
   * this method start orbit instance
   * and get providers for db
   * @param res: callback
   */
  async nodeReady (res) {
    log.info('Node ready')
    log.info('Loading db..')
    const raw = await this.getIngestKey()
    if (!raw) return false // Avoid move forward
    const address = this.sanitizeKey(raw)

    // Get orbit instance and next line connect providers
    this.orbit = await this.instanceOB()
    log.warn('Sanitized key:', address)
    this.emit('node-step', 'Connecting')

    await this.run(address, res) // Wait for orbit to open db
    this.emit('node-raised') // When all ready to handle orbit
    await provider.findProv(this.node, raw)
  }

  /**
     * Orbit db factory
  */
  instanceOB () {
    return (this.orbit && Promise.resolve(this.orbit)) ||
      OrbitDB.createInstance(this.node, this.conf.orbit)
  }

  /**
   * IPFS factory handler
   * try keep node alive if cannot do it after MAX_RETRIES
   * app get killed :(
   */
  instanceNode () {
    return new Promise(async (resolve) => {
      // If fail to much.. get fuck out
      log.info('Setting up node..')
      this.node = this.node || await ipfs.start(this.conf.ipfs)
      if (this.node) return resolve(this.node)
      // Hold on while raise node
      setTimeout(async () => {
        this.node = await this.instanceNode()
        resolve(this.node)
      }, DEFAULT_HOLD)
    })
  }

  start () {
    this.closed = false // Restore closed state
    if (this.ready) return Promise.resolve(this.db)
    return new Promise(async (resolve) => {
      log.info('Running ipfs node')
      // Create IPFS instance
      this.node = await this.instanceNode()
      await this.nodeReady(resolve)
    })
  }

  async close (forceDrop = false) {
    // Keep this states on top to avoid
    // run any event while nodes get closed
    this.closed = true // Closed already
    this.ready = false // Not ready if closed!

    try {
      if (this.orbit) {
        // Closing store
        log.warn('Killing Store')
        await this.orbit.disconnect()
        // Invalid cache or forceDrop db
        if (!this.hasValidCache || forceDrop) {
          log.warn('Flushing sync db')
          await this.db?.drop() // Remove all
          for (const k of ['total', 'limit']) {
            key.removeFromStorage(k)
          }
        }
      }

      if (this.node && this.node?.kill) {
        log.warn('Killing Nodes')
        await this.node.kill().catch(
          () => log.error('Fail trying to stop node')
        )
      }
      log.info('System closed')
    } catch (e) {
      log.error('Fails in system close')
      log.error(e.toString())
    }

    this.db = null
    this.orbit = null
    this.node = null
    this.peers.clear()
  }

  async get (hash) {
    const oplog = (this.db.oplog || this.db._oplog)
    const result = oplog.values.find(v => v.hash === hash)
    if (!result || !hash) return false
    return result.payload.value
    // console.log('Request hash', hash);
    // return this.db.get(hash).payload.value
  }
}
