const {CID} = require('ipfs-http-client')
const EventEmitter = require('events')
const OrbitDB = require('orbit-db');
const last = require('it-last')

const provider = require('./provs')
const ipfs = require('./ipfs')
const key = require('./key');
const log = require('logplease')
    .create('NODE')

const DEFAULT_HOLD = 10 * 1000

module.exports = class Node extends EventEmitter {
    constructor({rootPath}) {
        super();
        this.rootPath = rootPath;
        this.seedMode = false;
        this.peers = new Set();
        this.ready = false;
        this.closed = false;
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

    async getIngestKey() {
        return await this.resolveKey(
            this.rawIngestKey
        )
    }

    sanitizeKey(address) {
        return key.sanitizedKey(address)
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

    async resolveKey(ipns) {
        /**
         * Resolve ipns key if needed
         * @param ipns {string} IPNS hash
         * @return {string} Orbit address resolver key from ipns
         */
        if (!ipns) return false;
        if (~ipns.indexOf('zd')) return ipns

        try {
            // await this.waitForPeers();
            this.emit('node-step', 'Resolving')
            const cid = await last(this.node.name.resolve(ipns))
            const cleanedCID = cid.split('/').pop()
            const newCID = new CID(cleanedCID)
            return newCID.toBaseEncodedString('base58btc')
        } catch (e) {
            // Avoid using invalid keys
            if (!this.seedMode)
                await this.party()
            return false;
        }

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
            log.error(`Error opening db ${key}`)
            // this.emit('node-step', 'Retrying')
            // this.ready = false;
            // await this.start() // Retrying
        });

        this.db?.events?.on('peer', (p) => {
            log.info('Peer:', p);
            this.peers.add(p); // Add new peer to list
            this.emit('node-peer', this.peers.size)
        });

        if (this.db) { // Check if db set
            this.ready = true;
            log.info(`Ready in orbit ${key}`);
            this.emit('node-step', 'Replicating')
            this.emit('node-ready');
        }

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
        const raw = await this.getIngestKey();
        if (!raw) return false // Avoid move forward
        const address = this.sanitizeKey(raw)
        // Get orbit instance and next line connect providers
        this.orbit = await this.instanceOB();
        log.warn('Sanitized key:', address)
        this.emit('node-step', 'Connecting')
        await this.run(address, res);
        await provider.findProv(this.node, raw);

    }

    instanceOB() {
        /***
         * Orbit db factory
         */
        return (this.orbit && Promise.resolve(this.orbit))
            || OrbitDB.createInstance(this.node, {
                directory: this.rootPath
            });
    }

    instanceNode() {
        /***
         * Ipfs factory handler
         * try keep node alive if cannot do it after MAX_RETRIES
         * app get killed :(
         */
        return new Promise(async (res) => {
            // If fail to much.. get fuck out
            log.info('Setting up node..');
            this.node = this.node || await ipfs.start();
            if (this.node) return res(this.node)
            // Hold on while raise node
            setTimeout(async () => {
                this.node = await this.instanceNode();
                res(this.node)
            }, DEFAULT_HOLD)
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
                // Closing store
                log.warn('Killing Store');
                await this.orbit.disconnect()
                // Invalid cache or forceDrop db
                if (!this.hasValidCache || forceDrop) {
                    log.warn("Flushing sync db")
                    await this.db?.drop(); // Remove all
                    for (const k of ['total', 'limit'])
                        key.removeFromStorage(k)
                }
            }

            if (this.node) {
                log.warn('Killing Nodes');
                await this.node.kill().catch(
                    () => log.error('Fail trying to stop node')
                );
            }
            log.info('System closed');
        } catch (e) {
            log.error('Fails in system close');
            log.error(e.toString());
        }

        this.db = null;
        this.peers = [];
        this.orbit = null;
        this.node = null;
        this.ready = false;
        this.closed = true;
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