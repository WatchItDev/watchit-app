/**
 * IPFS movies interface
 */

const log = require('electron-log')
const Node = require('./node')
const Ingest = require('./ingest')

const {ROOT_ORBIT_DIR} = require('./settings')

module.exports = (ipcMain) => {

    const orbit = new Node({rootPath: ROOT_ORBIT_DIR});
    const ingest = new Ingest(orbit)

    const initEvents = (e) => {
        /***
         * Initialize events for orbit and ingesting process
         * @param {object} e ipcMain
         */
        // Remove listener before add new
        orbit.removeAllListeners();
        ingest.removeAllListeners();

        // Orbit node listeners
        orbit.on('node-error', (m) => e.reply('node-error', m))
        orbit.on('node-peer', (peerSize) => e.reply('node-peer', peerSize))
        orbit.on('node-chaos', (m) => {
            // Stop queue processor
            ipcMain.emit('party');
            e.reply('node-chaos', m);
            ingest.cleanInterval();
        })

        // Ingest process listener
        ingest.on('ingest-step', (step) => e.reply('node-step', step))
        ingest.on('ingest-replicated', (c, s, t) => e.reply('node-replicated', c, s, t))
        ingest.on('ingest-ready', () => e.reply('node-db-ready'))

    };

    ipcMain.on('node-start', async (e) => {
        // More listeners
        initEvents(e);
        // FIFO queue
        orbit.on('node-progress', (_, hash) => setImmediate(() => orbit.queue = hash))
            .on('node-step', (step) => e.reply('node-step', step))
            .on('node-ready', () => {
                ingest.queueProcessor();
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
            try {
                win?.webContents && win.webContents.send('node-step', 'Closing')
                ingest.cleanInterval();
                await orbit.close()
            } catch (e) {
                log.error('Error trying close node')
            }

        }
    }

};
