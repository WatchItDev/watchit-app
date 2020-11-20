/**
 * IPFS movies interface
 */
const path = require('path');
const IPFS = require('ipfs');
const Auth = require('./auth');
const P2P = require('./p2p');
const OrbitDB = require('orbit-db');
const bluebird = require("bluebird");
const BufferList = require('bl/BufferList')
const msgpack = require('msgpack-lite');


module.exports = (ipcMain, rootDir, inDev) => {
    const MAX_RETRIES = 30;
    const MAX_TIMEOUT = 60 * 1000;

    const CONF = {
        libp2p: P2P,
        repo: path.join(rootDir, '/w_source/ipfs'),
    };

    let isInstance = null;
    let orbitInstance = null;
    let interval = null;

    const getIsInstance = async () => {
        isInstance = await IPFS.create(CONF)
        if (inDev) { // Create stats interval if dev
            if (interval || !isInstance) clearInterval(interval);
            interval = setInterval(async () => {
                const id = await isInstance.id()
                const swap = await isInstance.bitswap.stat()
                const peers = await isInstance.swarm.peers()
                console.log('\nMyPeer: ', id.id);
                console.log('PeersConnected: ', peers.map((d) => d.peer));
                console.log('PeersSharing: ', swap.peers);
                console.log('WantList: ', swap.wantlist);
                console.log('BlocksReceived: ', swap.blocksReceived.toNumber());
                console.log('Data Received: ', swap.dataReceived.toNumber())
                console.log('Data Sent: ', swap.dataSent.toNumber())
                console.log('Block Sent: ', swap.blocksSent.toNumber(), '\n')
            }, 30 * 1000)
        }
        return isInstance
    }

    const getOrbitInstance = (node) => {
        let dir = path.join(rootDir, '/w_source/orbit')
        orbitInstance = OrbitDB.createInstance(node, {directory: dir});
        return orbitInstance
    }

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
            return this.orbit.open(
                `${address}/`, {
                    ...{
                        overwrite: true, replicate: true
                    }, ...settings
                }
            )
        }

        setInSeedMode(isRunningSeed = false) {
            this.seedMode = isRunningSeed
        }

        get publicKey() {
            return Auth.getPubKey()
        }

        get ingestKey() {
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
            console.log('Starting movies db..');
            this.db = await this.open(key);
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
            await this.close(true);
            ipcMain.emit('party');
            this._loopEvent('bc', msg)
            clearInterval(interval);
        }

        async cA(pathQuery, res, holdKill = 0) {
            // Await for hash ready
            let [root, chain] = pathQuery
            this.whenKill(holdKill); // When u need to be fuck it up!!

            try {
                let ingestRaw = await this.node.dag.get(root, {path: chain})
                Auth.addToStorage({'ingest': ingestRaw.value.key});
                res(this.ingestKey) // Send new ingest key
                this.holdKill(); // Not kill the buddy!!
            } catch (e) {
                console.log('Killing all');
                await this.party();
            }

        }

        async nodeReady(pathQuery, res) {
            // Create OrbitDB instance
            console.log('Node ready');
            console.log('Loading db..');
            this.orbit = await this.instanceOB();
            if (this.hasValidCache)
                return await this.run(
                    this.ingestKey, res
                );

            // Start run auth
            await this.cA(pathQuery, (key) => {
                this.run(key, res)
            })
        }

        instanceOB() {
            return this.orbit && Promise.resolve(this.orbit)
                || getOrbitInstance(this.node)
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
                    this.node = this.node || await getIsInstance();
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

        start(pathQuery = Auth.chain) {
            if (this.ready) return Promise.resolve(this.db);
            return new Promise(async (res) => {
                console.log(`Running ipfs node`);
                // Create IPFS instance
                this.node = await this.instanceNode();
                await this.nodeReady(pathQuery, res)
            })
        }

        whenKill(waitMore = 0) {
            console.log('Starting timer')
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(async () => {
                await this.party();
            }, MAX_TIMEOUT + (waitMore * 1000))
        }

        holdKill() {
            if (this.timeout) {
                console.log('Relax buddy');
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        }

        ping() {
            return new Promise(async (res) => {
                this.node = await this.instanceNode();
                this.orbit = await this.instanceOB();
                // Start timer to wait for response
                return this.cA(Auth.chain, (key) => {
                    console.log('All good');
                    this.ready = true;
                    res(key)
                }, 60 * 5)
            })
        }

        async close(forceDrop = false) {
            try {
                if (this.orbit) {
                    console.log('Killing Store');
                    await this.orbit.disconnect()

                    if (!this.hasValidCache || forceDrop) {
                        console.log('Drop DB;Index');
                        if (this.db) this.db.drop()
                        for (const k of ['total', 'ingest', 'limit'])
                            Auth.removeFromStorage(k)
                    }
                }

                if (this.node && this.node.isOnline()) {
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
            orbitInstance = null;
            isInstance = null;
        }

        get(hash) {
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
        let slice = 'chunk' in storage && storage.chunk || 0;
        const hasValidCache = orbit.hasValidCache
        if (!hasValidCache) e.reply('orbit-partial-progress', 'Starting');
        let collectionFromIPFS = await catIPFS(orbit.get(hash))

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

    ipcMain.on('orbit-ping', async (e) => {
        console.log('PING');
        await orbit.ping()
        e.reply('orbit-pong')
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
