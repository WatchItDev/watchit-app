/**
 * IPFS movies interface
 */

const BufferList = require('bl/BufferList')
const msgpack = require('msgpack-lite');
const log = require('electron-log')
const key = require('./key');
const Node = require('./node')
const QUEUE_SLEEP = 7000
const {ROOT_ORBIT_DIR} = require('./settings')

module.exports = (ipcMain) => {
    const orbit = new Node({
        rootPath: ROOT_ORBIT_DIR
    });

    let asyncLock = false;
    let queueInterval = null;

    const cleanInterval = () => {
        if (!queueInterval) return;
        log.warn('Cleaning queue interval')
        return clearInterval(queueInterval)
    }, catIPFS = async (cid) => {
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
        let storage = key.readFromStorage();
        let slice = ('chunk' in storage && storage.chunk) || 0;
        const hasValidCache = orbit.hasValidCache
        if (!hasValidCache) e.reply('node-step', 'Starting');

        // Check if hash exists in log
        let hashContent = await orbit.get(hash)
        if (!hashContent) {
            log.info('Hash cannot be found in op-log')
            log.info('Release Lock')
            asyncLock = false;
            return;
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

            e.reply('node-replicated', cleanedContent, sliced, tmp.toFixed(1));
            if (!hasValidCache) e.reply('node-db-ready'); // Ready to show!!!
            key.addToStorage({'chunk': sliced, 'tmp': tmp, 'lastHash': lastHash, 'total': total});
            if (sliced >= total) key.addToStorage({'cached': true, 'hash': [], 'lastHash': null})
            asyncLock = false; // Avoid overhead release lock
            log.info('Release Lock')
        }

    }, queueProcessor = (e) => {
        queueInterval = setInterval(async () => {
            const maxToReplicate = orbit.db?.replicationStatus?.max || 0
            if (asyncLock || Object.is(maxToReplicate, 0)) {
                log.info('Skip process queue')
                return false; // Skip if locked or no data received
            }

            const [validCache, cache] = orbit.cache;
            const currentQueue = orbit.queue
            const lastHash = cache.lastHash ?? 0;
            const queueLength = currentQueue.length

            if (!queueLength) return false; // Skip if not data in queue
            if (cache.cached) return cleanInterval();
            let indexLastHash = currentQueue.indexOf(lastHash) // Get index of last hash
            let nextHash = indexLastHash + 1 // Point cursor to next entry in queue
            if (nextHash > maxToReplicate) return cleanInterval(); // Clear interval on cursor overflow

            // Avoid array overflow
            let hash = currentQueue[nextHash]
            log.info(`Processing hash ${hash}`);
            log.info(`Processing with`, validCache ? 'valid cache' : 'no cache')
            asyncLock = true; // Lock process
            await partialSave(e, hash)
        }, QUEUE_SLEEP)

    }, initEvents = (e) => {
        /***
         * Initialize events for orbit
         */
        // More listeners
        orbit.removeAllListeners();
        orbit.on('node-error', (m) => e.reply('node-error', m))
            .on('node-peer', (peerSize) => e.reply('node-peer', peerSize))
            .on('node-chaos', (m) => {
                // Stop queue processor
                ipcMain.emit('party');
                e.reply('node-chaos', m)
                cleanInterval(queueInterval)
            })

    };

    ipcMain.on('node-start', async (e) => {
        // More listeners
        initEvents(e);
        // FIFO queue
        orbit.on('node-progress', (_, hash) => setImmediate(() => orbit.queue = hash))
            .on('node-step', (step) => e.reply('node-step', step))
            .on('node-ready', () => {
                queueProcessor(e);
                e.reply('node-ready');
            })

        log.info('Start orbit..');
        await orbit.start(e);
    });

    ipcMain.on('node-seed', async (e) => {
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

    ipcMain.on('node-close', async () => {
        log.warn('Closing orbit');
        await orbit.close();
    });

    ipcMain.on('node-flush', async () => {
        log.warn('Flushing orbit');
        await orbit.party('Logout')
    });

    return {
        closed: () => orbit.closed,
        close: async (win) => {
            win?.webContents && win.webContents.send('node-step', 'Closing')
            cleanInterval(queueInterval)
            await orbit.close()
        }
    }

};
