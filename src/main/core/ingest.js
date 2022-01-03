const log = require('logplease').create('INGEST')
const EventEmitter = require('events')
const msgpack = require('msgpack-lite')
const key = require('./key')
const QUEUE_SLEEP = 5000

module.exports = class Ingest extends EventEmitter {
  constructor (orbit) {
    super()
    this.orbit = orbit
    this.queueInterval = null
    this.asyncLock = false
  }

  set queue (hash) {
    log.info('Storing hash in queue')
    const cache = key.readFromStorage()
    const cacheList = cache.hash ?? []
    // Deduplication with sets
    const newHash = [...new Set([...cacheList, ...[hash]])]
    key.addToStorage({ hash: newHash })
  }

  get queue () {
    const cache = key.readFromStorage()
    return cache?.hash ?? []
  }

  static getInstance (orbit) {
    return new Ingest(orbit)
  }

  cleanInterval () {
    if (!this.queueInterval) return
    log.warn('Cleaning queue interval')
    this.asyncLock = false
    return clearInterval(this.queueInterval)
  }

  async cat (cid) {
    try {
      log.info('Fetching and reaching providers for CID:', cid)
      for await (const buffer of this.orbit.node.get(cid)) {
        return { content: msgpack.decode(buffer.toString()) }
      }
    } catch (e) {
      log.error('Error trying fetch CID', cid, 'from network')
    }
  }

  async partialSave (hash) {
    log.info('Going take chunks')
    const storage = key.readFromStorage()
    const slice = ('chunk' in storage && storage.chunk) || 0
    const hasValidCache = this.orbit.hasValidCache
    if (!hasValidCache) this.emit('ingest-step', 'Starting')

    // Check if hash exists in log
    const hashContent = await this.orbit.get(hash)
    if (!hashContent) {
      log.info('Hash cannot be found in op-log')
      log.info('Release Lock')
      this.asyncLock = false
      return
    }

    const collectionFromIPFS = await this.cat(hashContent)
    if (collectionFromIPFS) { // If has data
      const cleanedContent = collectionFromIPFS.content
      const slicedSize = cleanedContent.length

      const lastHash = hash
      const total = parseInt(cleanedContent[0].total)
      const sliced = slice + slicedSize
      const tmp = (sliced / total) * 100

      log.info('Total:', total)
      log.info('Pending:', total - sliced)
      log.info('Load collection size:', slicedSize)
      log.info('Last hash:', lastHash)

      this.emit('ingest-replicated', cleanedContent, sliced, tmp.toFixed(1))
      // if (!hasValidCache) this.emit('ingest-ready'); // Ready to show!!!
      key.addToStorage({ chunk: sliced, tmp: tmp, lastHash: lastHash, total: total })
      if (sliced >= total) key.addToStorage({ cached: true, hash: [], lastHash: null })
      this.asyncLock = false // Avoid overhead release lock
      log.info('Release Lock')
    }
  }

  async queueProcessor () {
    this.queueInterval = setInterval(async () => {
      const maxToReplicate = this.orbit.db?.replicationStatus?.max || 0
      if (this.asyncLock || Object.is(maxToReplicate, 0)) {
        log.info('Skip process queue. Waiting for data or lock release')
        return false // Skip if locked or no data received
      }

      const [validCache, cache] = this.orbit.cache
      const currentQueue = this.queue
      const lastHash = cache.lastHash ?? 0
      const queueLength = currentQueue.length

      if (!queueLength) return false // Skip if not data in queue
      if (cache.cached) return this.cleanInterval()
      const indexLastHash = currentQueue.indexOf(lastHash) // Get index of last hash
      const nextHash = indexLastHash + 1 // Point cursor to next entry in queue
      if (nextHash > maxToReplicate) return this.cleanInterval() // Clear interval on cursor overflow

      // Avoid array overflow
      const hash = currentQueue[nextHash]
      log.info(`Processing hash ${hash}`)
      log.info('Processing with', validCache ? 'valid cache' : 'no cache')
      this.asyncLock = true // Lock process
      await this.partialSave(hash)
    }, QUEUE_SLEEP)
  }
}
