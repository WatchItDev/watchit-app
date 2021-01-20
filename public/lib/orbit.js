/**
 * IPFS movies interface
 */
const path = require('path');
const Auth = require('./auth');
const OrbitDB = require('orbit-db');
// const bluebird = require("bluebird");
const BufferList = require('bl/BufferList')
const msgpack = require('msgpack-lite');
const getIsInstance = require('./ipfs')
const {findProv} = require('./provs')


module.exports = (ipcMain, rootDir, inDev) => {
    const MAX_RETRIES = 30;
    const orbitRepo = path.join(rootDir, '/w_source/orbit')

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
                error: null, ba: null, replicated: null
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
            const [validCache, _] = this.cache;
            return validCache
        }

        get cache() {
            let cache = Auth.readFromStorage();
            let validCache = cache && 'tmp' in cache;
            return [validCache, cache]
        }

        async run(key, res) {
            console.log('Starting movies db:', key);
            this.db = await this.open(key).catch(async () => {
                // If db cannot be opened then just kill
                await this.party('Cannot find peers')
            });

            this.db.events.on('peer', (p) => {
                console.log('Peer:', p);
                if (!this.peers.includes(p)) {
                    this.peers.push(p); // Add new peer to list
                    this._loopEvent('peer', this.peers.length)
                }
            });

            console.log(`Ready in orbit ${key}`);
            this._loopEvent('ready');
            this.ready = true;

            this.db.events.on('ready', () => this._loopEvent('loaded'))
            this.db.events.on('replicated', (address, t) => {
                this._loopEvent('replicated', address, t)
            });
            this.db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
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
            console.log('Party rock');
            clearInterval(this.node.interval);
            await this.close(true);
            ipcMain.emit('party');
            this._loopEvent('bc', msg)
        }


        async nodeReady(res) {
            /***
             * Get orbit node ready
             * this method start orbit instance
             * and get providers for db
             */
            console.log('Node ready');
            console.log('Loading db..');
            const address = this.ingestKey;
            const rawAddress = this.rawIngestKey

            // Get orbit instance and next line connect providers
            // Serve as provider too :)
            this.orbit = await this.instanceOB();
            await findProv(this.node, rawAddress);
            return await this.run(address, res);

        }

        instanceOB() {
            return (this.orbit && Promise.resolve(this.orbit))
                || OrbitDB.createInstance(this.node, {directory: orbitRepo});
        }

        instanceNode() {
            return new Promise(async (res) => {
                // If fail to much.. get fuck out
                if (this.retry > MAX_RETRIES && !this.hasValidCache) {
                    this.retry = 0; // Avoid remove if in seed mode
                    if (!this.seedMode) // If not seed mode
                        return await this.party('Aborting')
                }

                try {
                    console.log('Setting up node..');
                    this.node = this.node || await getIsInstance(inDev);
                    res(this.node)
                } catch (e) {
                    console.log(e.toString())
                    console.log(e.code || 'Error on listen')
                    this._loopEvent('error')
                    try {
                        console.log('Trying stop');
                        await this.node.stop()
                    } catch (e) {
                        console.log('Already stop node');
                    }
                    // Any other .. just retry
                    setTimeout(async () => {
                        console.log('Retrying ' + this.retry);
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
                console.log(`Running ipfs node`);
                // Create IPFS instance
                this.node = await this.instanceNode();
                await this.nodeReady(res)
            })
        }


        async close(forceDrop = false) {
            try {
                if (this.orbit) {
                    console.log('Killing Store');
                    await this.orbit.disconnect()

                    if (!this.hasValidCache || forceDrop) {
                        console.log('Drop DB;Index');
                        // if (this.db) this.db.drop()
                        for (const k of ['total', 'ingest', 'limit'])
                            Auth.removeFromStorage(k)
                    }
                }

                if (this.node) {
                    console.log('Killing Nodes');
                    await this.node.stop().catch(err => console.error(err));
                }
                console.log('System closed');
            } catch (e) {
                console.log('Fails in system close');
                console.log(e.toString());
                console.log(e.code);
            }

            this.peers = [];
            this.orbit = null;
            this.node = null;
            this.db = null;
            this.ready = false;
        }

        async get(hash) {
            // const oplog = (this.db.oplog || this.db._oplog)
            // const result = oplog.values.find(v => v.hash === hash)
            // return result.payload.value

            return this.db.get(
                hash // Process incoming hash
            ).payload.value
        }

        removeDuplicates(hashList) {
            return hashList.filter((value, index, self) => {
                return self.indexOf(value) === index
            })
        }


        set queue(hash) {
            console.log('Storing hash in queue');
            let cache = Auth.readFromStorage();
            let cacheList = cache.hash ?? []
            let newHash = cacheList.concat(hash)
            Auth.addToStorage({ // Restore list cleaned
                hash: this.removeDuplicates(newHash)
            })
        }

        get queue() {
            let cache = Auth.readFromStorage();
            return cache.hash ?? []
        }

    }

    const orbit = new Orbit();
    let asyncLock = false;
    let queueInterval = null;

    const catIPFS = async (cid) => {
        for await (const file of orbit.node.get(cid)) {
            if (!file.content) continue;

            // console.log(`Processing ${c.cid}`);
            const content = new BufferList()
            for await (const chunk of file.content) content.append(chunk)
            return {'content': msgpack.decode(content.slice())};
        }
    }, partialSave = async (e, hash) => {
        console.log('Going take chunks');
        let storage = Auth.readFromStorage();
        let slice = ('chunk' in storage && storage.chunk) || 0;
        const hasValidCache = orbit.hasValidCache
        if (!hasValidCache) e.reply('orbit-partial-progress', 'Starting');

        let hashContent = await orbit.get(hash)
        let collectionFromIPFS = await catIPFS(hashContent)

        if (collectionFromIPFS) { // If has data
            let cleanedContent = collectionFromIPFS['content']
            let slicedSize = cleanedContent.length

            let lastHash = hash;
            let total = parseInt(cleanedContent[0]['total'])
            let sliced = slice + slicedSize
            let tmp = (sliced / total) * 100;

            console.log('Total:', total)
            console.log('Pending:', total - sliced)
            console.log('Load collection size:', slicedSize);
            console.log('Last hash:', lastHash);

            e.reply('orbit-replicated', cleanedContent, sliced, tmp.toFixed(1));
            if (!hasValidCache) e.reply('orbit-db-ready'); // Ready to show!!!
            Auth.addToStorage({'chunk': sliced, 'tmp': tmp, 'lastHash': lastHash, 'total': total});
            if (sliced >= total) Auth.addToStorage({'cached': true, 'hash': [], 'lastHash': null})
            asyncLock = false; // Avoid overhead release lock
            console.log('Release Lock')
        }

    }, queueProcessor = (e) => {
        queueInterval = setInterval(async () => {
            if (asyncLock) return false;

            const [_, cache] = orbit.cache;
            const currentQueue = orbit.queue
            const lastHash = cache.lastHash ?? 0;

            if (!currentQueue.length) return false;
            let indexLastHash = currentQueue.indexOf(lastHash)
            let hash = currentQueue[indexLastHash + 1]

            console.log(`Processing hash ${hash}`);
            asyncLock = true; // Lock process
            await partialSave(e, hash)

            if (cache.cached && queueInterval)
                return clearInterval(queueInterval)
        }, 1000)

    };

    ipcMain.on('start-orbit', async (e) => {
        // More listeners
        orbit.stopEvents();
        orbit.on('ba', (p) => e.reply('party-progress', p))
            .on('bc', (m) => e.reply('party-rock', m))
            .on('error', (m) => e.reply('orbit-error', m))
            .on('peer', (peerSize) => e.reply('orbit-peer', peerSize))
            .on('progress', (_, hash) => orbit.queue = hash) // FIFO
            .on('ready', () => {
                queueProcessor(e);
                e.reply('orbit-ready');
            })

        console.log('Start orbit..');
        await orbit.start();
    });

    ipcMain.on('orbit-seed', async (e) => {
        console.log('Starting seed');
        orbit.setInSeedMode(true);
        orbit.on('bc', (m) => e.reply('party-rock', m))
        await orbit.start()
    });


    ipcMain.on('online-status-changed', async (e, isOnline) => {
        console.log('Going ' + (isOnline ? 'online' : 'offline'))
        if (!isOnline) await orbit.close();
        if (isOnline) await orbit.start();
    })

    ipcMain.on('orbit-close', async () => {
        console.log('Closing orbit');
        await orbit.close();
    });

    ipcMain.on('orbit-flush', async () => {
        console.log('Flushing orbit');
        await orbit.party()
    });

};
