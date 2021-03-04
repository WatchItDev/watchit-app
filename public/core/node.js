const log = require('electron-log')
const EventEmitter = require('events')
const OrbitDB = require('orbit-db');
const {ROOT_ORBIT_DIR} = require('./settings')
const getIsInstance = require('./ipfs')
const {findProv} = require('./provs')
const key = require('./key');
const MAX_RETRIES = 30;


module.exports = class Node extends EventEmitter {
    constructor() {
        super();
        this.timeout = null;
        this.seedMode = false;
        this.peers = [];
        this.retry = 0;
        this.ready = false;
        this.orbit = null;
        this.node = null;
        this.db = null;
    }


    get [Symbol.toStringTag]() {
        return 'Node'
    }


    open(address, settings = {}) {
        return this.orbit.open(address, {
                ...{replicate: true, overwrite: true},
                ...settings
            }
        )
    }

    setInSeedMode(isRunningSeed = false) {
        this.seedMode = isRunningSeed
    }

    get ingestKey() {
        return key.sanitizedKey(
            this.rawIngestKey
        )
    }

    get rawIngestKey() {
        return key.getIngestKey()
    }

    get hasValidCache() {
        const [validCache] = this.cache;
        return validCache
    }

    get cache() {
        let cache = key.readFromStorage();
        let validCache = cache && 'tmp' in cache;
        return [validCache, cache]
    }

    async run(key, res) {
        /***
         * Opem orbit address and set events listeners
         * @param key: orbit address
         * @param res: callback
         */
        log.info('Starting movies db:', key);
        this.db = await this.open(key).catch(async (e) => {
            // If db cannot be opened then just kill
            log.error(`Cannot find peers ${e}`)
        });

        this.db?.events?.on('peer', (p) => {
            log.info('Peer:', p);
            this.peers.push(p); // Add new peer to list
            this.emit('node-peer', this.peers.length)
        });

        log.info(`Ready in orbit ${key}`);
        this.emit('node-step', 'Replicating')
        this.emit('node-ready');
        this.ready = true;

        this.db?.events?.on('ready', () => this.emit('loaded'))
        this.db?.events?.on('replicated', (address, t) => {
            this.emit('node-replicated', address, t)
        });
        this.db?.events?.on('replicate.progress', (address, hash, entry, progress, have) => {
            this.emit('node-progress', address, hash, entry, progress, have)
        });

        res(this.db)
    }


    async party(msg = 'Invalid Key') {
        /***
         * Kill all - party all
         */
        log.warn('Party rock');
        await this.close(true);
        this.emit('node-chaos', msg)
    }


    async nodeReady(res) {
        /***
         * Get orbit node ready
         * this method start orbit instance
         * and get providers for db
         * @param res: callback
         */
        log.info('Node ready');
        log.info('Loading db..');
        const address = this.ingestKey;
        const rawAddress = this.rawIngestKey

        // Get orbit instance and next line connect providers
        // Serve as provider too :)
        this.orbit = await this.instanceOB();
        this.emit('node-step', 'Connecting')
        await this.run(address, res);
        await findProv(this.node, rawAddress);

    }

    instanceOB() {
        /***
         * Orbit db factory
         */
        return (this.orbit && Promise.resolve(this.orbit))
            || OrbitDB.createInstance(this.node, {directory: ROOT_ORBIT_DIR});
    }

    instanceNode() {
        /***
         * Ipfs factory handler
         * try keep node alive if cannot do it after MAX_RETRIES
         * app get killed :(
         */
        return new Promise(async (res) => {
            // If fail to much.. get fuck out
            if (this.retry > MAX_RETRIES && !this.hasValidCache) {
                this.retry = 0; // Avoid remove if in seed mode
                if (!this.seedMode) // If not seed mode
                    return await this.party('Aborting')
            }

            try {
                log.info('Setting up node..');
                this.node = this.node || await getIsInstance();
                res(this.node)
            } catch (e) {
                log.error('Fail starting node')
                this.emit('node-error')
                // Any other .. just retry
                setTimeout(async () => {
                    log.warn('Retrying ' + this.retry);
                    this.node = null;
                    this.retry++;
                    res(await this.instanceNode())
                }, 10 * 1000)
            }
        })
    }

    start() {
        if (this.ready) return Promise.resolve(this.db);
        return new Promise(async (res) => {
            log.info(`Running ipfs node`);
            // Create IPFS instance
            this.node = await this.instanceNode();
            await this.nodeReady(res)
        })
    }


    async close(forceDrop = false) {
        try {
            if (this.orbit) {
                log.warn('Killing Store');
                await this.orbit.disconnect()
                if (!this.hasValidCache || forceDrop) {
                    for (const k of ['total', 'limit'])
                        key.removeFromStorage(k)
                }
            }

            if (this.node) {
                log.warn('Killing Nodes');
                await this.node.stop().catch(
                    err => log.error(err.message)
                );
            }
            log.info('System closed');
        } catch (e) {
            log.error('Fails in system close');
            log.error(e.toString());
        }

        this.peers = [];
        this.orbit = null;
        this.node = null;
        this.db = null;
        this.ready = false;
    }

    async get(hash) {
        const oplog = (this.db.oplog || this.db._oplog)
        const result = oplog.values.find(v => v.hash === hash)
        if (!result || !hash) return false;
        return result.payload.value
        // console.log('Request hash', hash);
        // return this.db.get(hash).payload.value
    }

    set queue(hash) {
        log.info('Storing hash in queue');
        let cache = key.readFromStorage();
        let cacheList = cache.hash ?? []
        // Deduplication with sets
        let newHash = [...new Set([...cacheList, ...[hash]])]
        key.addToStorage({hash: newHash})
    }

    get queue() {
        let cache = key.readFromStorage();
        return cache?.hash ?? []
    }

}