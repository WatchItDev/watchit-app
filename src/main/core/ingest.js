const log = require('logplease').create('INGEST')
const EventEmitter = require('events')
const BufferList = require('bl/BufferList')
const msgpack = require('msgpack-lite');
const key = require('./key');
const QUEUE_SLEEP = 7000

module.exports = class Ingest extends EventEmitter {
    constructor(orbit) {
        super();
        this.orbit = orbit
        this.queueInterval = null;
        this.asyncLock = false;

    }

    cleanInterval() {
        if (!this.queueInterval) return;
        log.warn('Cleaning queue interval')
        return clearInterval(this.queueInterval)
    }

    async cat(cid) {
        log.info('Fetching cid', cid);

        try {
            for await (const file of this.orbit.node.get(cid)) {
                if (!file.content) continue;

                // log.info(`Processing ${c.cid}`);
                const content = new BufferList()
                for await (const chunk of file.content) content.append(chunk)
                return {'content': msgpack.decode(content.slice())};
            }
        } catch (e) {
            log.error('Error trying fetch CID', cid, 'from network')
        }

    }

    async partialSave(hash) {
        log.info('Going take chunks');
        let storage = key.readFromStorage();
        let slice = ('chunk' in storage && storage.chunk) || 0;
        const hasValidCache = this.orbit.hasValidCache
        if (!hasValidCache) this.emit('ingest-step', 'Starting');

        // Check if hash exists in log
        let hashContent = await this.orbit.get(hash)
        if (!hashContent) {
            log.info('Hash cannot be found in op-log')
            log.info('Release Lock')
            this.asyncLock = false;
            return;
        }

        let collectionFromIPFS = await this.cat(hashContent)
        if (collectionFromIPFS) { // If has data
            let cleanedContent = collectionFromIPFS['content']
            let slicedSize = cleanedContent.length

            let lastHash = hash;
            let total = parseInt(cleanedContent[0]['total'])
            let sliced = slice + slicedSize
            let tmp = (sliced / total) * 100;

            log.info('Total:', total)
            log.info('Pending:', total - sliced)
            log.info('Load collection size:', slicedSize);
            log.info('Last hash:', lastHash);

            this.emit('ingest-replicated', cleanedContent, sliced, tmp.toFixed(1));
            if (!hasValidCache) this.emit('ingest-ready'); // Ready to show!!!
            key.addToStorage({'chunk': sliced, 'tmp': tmp, 'lastHash': lastHash, 'total': total});
            if (sliced >= total) key.addToStorage({'cached': true, 'hash': [], 'lastHash': null})
            this.asyncLock = false; // Avoid overhead release lock
            log.info('Release Lock')
        }

    }

    async queueProcessor() {
        this.queueInterval = setInterval(async () => {
            const maxToReplicate = this.orbit.db?.replicationStatus?.max || 0
            if (this.asyncLock || Object.is(maxToReplicate, 0)) {
                log.info('Skip process queue')
                return false; // Skip if locked or no data received
            }

            const [validCache, cache] = this.orbit.cache;
            const currentQueue = this.orbit.queue
            const lastHash = cache.lastHash ?? 0;
            const queueLength = currentQueue.length

            if (!queueLength) return false; // Skip if not data in queue
            if (cache.cached) return this.cleanInterval();
            let indexLastHash = currentQueue.indexOf(lastHash) // Get index of last hash
            let nextHash = indexLastHash + 1 // Point cursor to next entry in queue
            if (nextHash > maxToReplicate) return this.cleanInterval(); // Clear interval on cursor overflow

            // Avoid array overflow
            let hash = currentQueue[nextHash]
            log.info(`Processing hash ${hash}`);
            log.info(`Processing with`, validCache ? 'valid cache' : 'no cache')
            this.asyncLock = true; // Lock process
            await this.partialSave(hash)
        }, QUEUE_SLEEP)

    }
}