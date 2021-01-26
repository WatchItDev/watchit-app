/**
 * IPFS movies interface
 */

const OrbitDB = require('orbit-db');
const BufferList = require('bl/BufferList')
const msgpack = require('msgpack-lite');
const {ROOT_ORBIT_DIR} = require('./settings')
const Auth = require('./auth');
const getIsInstance = require('./ipfs')
const {findProv} = require('./provs')
const log = require('electron-log')


module.exports = (ipcMain) => {
    const MAX_RETRIES = 30;

    class Orbit {
        constructor() {
            this.timeout = null;
            this.seedMode = false;
            this.found = false;
            this.peers = [];
            this.retry = 0;
            this.ready = false;
            this.orbit = null;
            this.node = null;
            this.db = null;
            this.events = {
                ready: null, peer: null, loaded: null,
                loading: null, progress: null, bc: null,
                error: null, replicated: null
            }
        }


        get [Symbol.toStringTag]() {
            return 'OrbitWatch'
        }

        on(event, fn) {
            //Events dict
            if (event in this.events) {
                this.events[event] = fn
            }

            return this;
        }

        _loopEvent(e, ...params) {
            if (e in this.events && this.events[e]) {
                this.events[e](...params)
            }
        }

        open(address, settings = {}) {
            return this.orbit.open(address, {
                    ...{overwrite: true, replicate: true},
                    ...settings
                }
            )
        }

        setInSeedMode(isRunningSeed = false) {
            this.seedMode = isRunningSeed
        }

        get ingestKey() {
            return Auth.sanitizedKey(
                this.rawIngestKey
            )
        }

        get rawIngestKey() {
            return Auth.getIngestKey()
        }

        get hasValidCache() {
            const [validCache] = this.cache;
            return validCache
        }

        get cache() {
            let cache = Auth.readFromStorage();
            let validCache = cache && 'tmp' in cache;
            return [validCache, cache]
        }

        async run(key, res, ipc) {
            /***
             * Opem orbit address and set events listeners
             * @param key: orbit address
             * @param res: callback
             * @param ipc: ipcMain
             */
            log.info('Starting movies db:', key);
            this.db = await this.open(key).catch(async () => {
                // If db cannot be opened then just kill
                await this.party('Cannot find peers')
            });

            this.db?.events?.on('peer', (p) => {
                log.info('Peer:', p);
                this.peers.push(p); // Add new peer to list
                this._loopEvent('peer', this.peers.length)
            });

            log.info(`Ready in orbit ${key}`);
            ipc.reply('orbit-progress', 'Replicating')
            this._loopEvent('ready');
            this.ready = true;

            this.db?.events?.on('ready', () => this._loopEvent('loaded'))
            this.db?.events?.on('replicated', (address, t) => {
                this._loopEvent('replicated', address, t)
            });
            this.db?.events?.on('replicate.progress', (address, hash, entry, progress, have) => {
                this._loopEvent('progress', address, hash, entry, progress, have)
            });

            res(this.db)
        }

        stopEvents() {
            Object.keys(this.events).forEach(
                (i) => this.events[i] = null
            )
            return this;
        }

        async party(msg = 'Invalid Key') {
            /***
             * Kill all - party all
             */
            log.warn('Party rock');
            await this.close(true);
            ipcMain.emit('party');
            this._loopEvent('bc', msg)
        }


        async nodeReady(res, ipc) {
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
            ipc.reply('orbit-progress', 'Connecting')
            await findProv(this.node, rawAddress);
            await this.run(address, res, ipc);

        }

        instanceOB() {
            /***
             * Orbit db factory
             */
            return (this.orbit && Promise.resolve(this.orbit))
                || OrbitDB.createInstance(this.node, {directory: ROOT_ORBIT_DIR});
        }

        instanceNode(ipc) {
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
                    this.node = this.node || await getIsInstance(ipc);
                    res(this.node)
                } catch (e) {
                    log.error('Fail starting node', e.message)
                    this._loopEvent('error')
                    // Any other .. just retry
                    setTimeout(async () => {
                        log.warn('Retrying ' + this.retry);
                        this.node = null;
                        this.retry++;
                        res(await this.instanceNode(ipc))
                    }, 10 * 1000)
                }
            })
        }

        start(ipc) {
            if (this.ready) return Promise.resolve(this.db);
            return new Promise(async (res) => {
                log.info(`Running ipfs node`);
                // Create IPFS instance
                this.node = await this.instanceNode(ipc);
                await this.nodeReady(res, ipc)
            })
        }


        async close(forceDrop = false) {
            try {
                if (this.orbit) {
                    log.warn('Killing Store');
                    await this.orbit.disconnect()
                    if (!this.hasValidCache || forceDrop) {
                        for (const k of ['total', 'limit'])
                            Auth.removeFromStorage(k)
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

        removeDuplicates(hashList) {
            return hashList.filter((value, index, self) => {
                return self.indexOf(value) === index
            })
        }


        set queue(hash) {
            log.info('Storing hash in queue');
            let cache = Auth.readFromStorage();
            let cacheList = cache.hash ?? []
            let newHash = cacheList.concat(hash)
            Auth.addToStorage({ // Restore list cleaned
                hash: this.removeDuplicates(newHash)
            })
        }

        get queue() {
            let cache = Auth.readFromStorage();
            return cache?.hash ?? []
        }

    }

    const orbit = new Orbit();
    let asyncLock = false;
    let queueInterval = null;

    const catIPFS = async (cid) => {
        log.info('Fetching cid', cid);
        try {
            for await (const file of orbit.node.get(cid)) {
                if (!file.content) continue;

                // log.info(`Processing ${c.cid}`);
                const content = new BufferList()
                for await (const chunk of file.content) content.append(chunk)
                return {'content': msgpack.decode(content.slice())};
            }
        } catch (e) {
            log.error('Error trying fetch CID', cid, 'from network')
        }

    }, partialSave = async (e, hash) => {
        log.info('Going take chunks');
        let storage = Auth.readFromStorage();
        let slice = ('chunk' in storage && storage.chunk) || 0;
        const hasValidCache = orbit.hasValidCache
        if (!hasValidCache) e.reply('orbit-partial-progress', 'Starting');
        // Check if hash exists in log
        let hashContent = await orbit.get(hash)
        if (!hashContent) {
            log.error('Hash cannot be found in op-log:', hash)
            log.info('Release Lock')
            return asyncLock = false;
        }

        let collectionFromIPFS = await catIPFS(hashContent)
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

            e.reply('orbit-replicated', cleanedContent, sliced, tmp.toFixed(1));
            if (!hasValidCache) e.reply('orbit-db-ready'); // Ready to show!!!
            Auth.addToStorage({'chunk': sliced, 'tmp': tmp, 'lastHash': lastHash, 'total': total});
            if (sliced >= total) Auth.addToStorage({'cached': true, 'hash': [], 'lastHash': null})
            asyncLock = false; // Avoid overhead release lock
            log.info('Release Lock')
        }

    }, queueProcessor = (e) => {
        queueInterval = setInterval(async () => {
            if (asyncLock) return false;

            const [validCache, cache] = orbit.cache;
            const currentQueue = orbit.queue
            const lastHash = cache.lastHash ?? 0;
            const queueLength = currentQueue.length

            if (!queueLength) return false;
            let indexLastHash = currentQueue.indexOf(lastHash)

            // Avoid if array overflow
            if (indexLastHash <= queueLength) {
                let hash = currentQueue[indexLastHash + 1]
                log.info(`Processing hash ${hash}`);
                log.info(`Processing with`, validCache ? 'valid cache' : 'no cache')
                asyncLock = true; // Lock process
                await partialSave(e, hash)
            }

            if (cache.cached && queueInterval){
                info.warn('Cleaning queue interval')
                return clearInterval(queueInterval)
            }
        }, 1000)

    }, initEvents = (e) => {
        /***
         * Initialize events for orbit
         */
        // More listeners
        orbit.stopEvents();
        orbit.on('bc', (m) => e.reply('party-rock', m))
            .on('error', (m) => e.reply('orbit-error', m))
            .on('peer', (peerSize) => e.reply('orbit-peer', peerSize))

    };

    ipcMain.on('start-orbit', async (e) => {
        // More listeners
        initEvents(e);
        // FIFO queue
        orbit.on('progress', (_, hash) => orbit.queue = hash)
            .on('ready', () => {
                queueProcessor(e);
                e.reply('orbit-ready');
            })
        log.info('Start orbit..');
        await orbit.start(e);
    });

    ipcMain.on('orbit-seed', async (e) => {
        log.info('Starting seed');
        initEvents(e)
        orbit.setInSeedMode(true);
        await orbit.start(e)
    });


    ipcMain.on('online-status-changed', async (e, isOnline) => {
        log.info('Going ' + (isOnline ? 'online' : 'offline'))
        if (!isOnline) await orbit.close();
        if (isOnline) await orbit.start();
    })

    ipcMain.on('orbit-close', async () => {
        log.warn('Closing orbit');
        await orbit.close();
    });

    ipcMain.on('orbit-flush', async () => {
        log.warn('Flushing orbit');
        await orbit.party()
    });

};
