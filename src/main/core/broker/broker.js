const Key = require('../key');
const EventEmitter = require('events')
const logplease = require('logplease')
const log = logplease.create('BROKER', {color: logplease.Colors.Yellow})

const Engine = Key.engine
const LinvoDB = require("linvodb3");
LinvoDB.dbPath = Key.init.db
LinvoDB.defaults.store = {db: Engine};
LinvoDB.defaults.autoIndexing = false
log.info(`Using ${Engine.name}`)

// ipcRender listeners
const DB = 'wt'

const IPC_LISTENERS = [
    'node-chaos',
    'node-peer',
    'node-error',
    'node-ready',
    'node-ready',
    'node-loaded',
    'node-progress',
    'node-replicated'
]

// Capture unhandled exceptions
process?.on('uncaughtException', () => {
    log.warn('Uncaught Exception: keeping process alive');
});

module.exports = class Broker extends EventEmitter {
    constructor(renderer) {
        super()
        this.renderer = renderer;
        this.initStore();

    }

    initStore() {
        /**
         * Singleton initialize db
         * @type {function(*=): void}
         */
        log.warn('Creating local db')
        if (this.db) return this.db;
        this.db = new LinvoDB(DB)
    }

    flush() {
        /**
         * Kill all this shit XD
         * */

        this.db.remove({}, {multi: true},
            (err, numRemoved) => {
                if (err) log.error(err)
                log.info('Flushed db entries: ', numRemoved)
                this.renderer.send('node-flush');
            });
    }

    getIPC() {
        // Inter process handler
        return this.renderer
    }

    stopIpcEvents(ipcListeners = []) {
        /***
         * Clear ipc electron events to avoid
         * over declarative events
         */
        const listeners = ipcListeners.length
            ? ipcListeners : IPC_LISTENERS;

        (listeners).forEach((l) => {
            log.info('Cleaning:', l);
            this.renderer.removeAllListeners(l)
        })

        return this;
    }

    startSeed() {
        /***
         * Run app as seed mode
         */
        log.info('Run Seed');
        this.renderer.send('node-seed')
        return this;
    }

    emitStart() {
        /***
         * Init signal to start node running
         */
        this.renderer.send('node-start');
        return this;
    }

    broadcastMessage(message) {
        /**
         * Broadcast message from renderer
         */
        this.renderer.send('node-broadcast', message)
        return this;
    }


    listenForNewPeer() {
        /***
         * New peers interception and caching for stats
         */
        this.renderer.on('node-peer', (e, p) => {
            log.info('New peer', p);
            Key.addToStorage({'peers': p});
            this.emit('peer', p)

        })
    }


    listenForPartyRock() {
        /***
         * Cannot connect or any invalid key provided
         */
        this.renderer.on('node-chaos', (e, m) => {
            this.emit('chaos', m)
        })
    }

    listenForError() {
        /***
         * Any error in node
         */
        this.renderer.on('node-error', (e, m) => {
            this.emit('error', m)
        })
    }

    listenForReady() {
        /**
         * Trigger event before node get ready tu run
         * could be used to clear storage or data previous to run app
         */
        this.renderer.on('node-ready', (e, c) => {
            this.emit('start', c)

        })
    }

    listenForDbLoaded() {
        /***
         * Trigger event when all db are synced
         */
        this.renderer.on('node-loaded', (e, c) => {
            this.emit('done', c)
        })
    }

    listenForReplicaProgress() {
        /***
         * Replicate process event
         */
        this.renderer.on('node-step', (e, step) => {
            this.emit('progress', step)
        })
    }

    listenForReplicatedData() {
        /***
         * Trigger event when new data its replicated
         */
        this.renderer.on('node-replicated', async (e, collection) => {
            log.info('LOADING FROM NETWORK');
            log.info(collection[collection.length - 1]['_id']);
            log.info(collection[0]['_id']); // get id for ingested chunk
            const total = this.db.getAllData().length;
            const firstChunk = Object.is(total, 0);
            this.db.insert(collection, (e, n) => {
                if (e) return; // Avoid `n.length` undefined
                if (firstChunk) {
                    log.warn('First chunk inserted')
                    this.emit('ready');
                }

                log.info(`Inserted: ${n?.length || 0}`)
                log.info(`Total:`, total + n.length)

            }); // Save in local
            this.emit('replicated')
        })
    }

    load() {
        /***
         * This method add method to electron ipcRender
         * and serve as intermediary between render and main process
         */
        // Clean old listeners first
        log.info('Broker ready')
        this.stopIpcEvents();
        this.emitStart();
        this.listenForPartyRock();
        this.listenForNewPeer();
        this.listenForError();
        this.listenForReady()
        this.listenForDbLoaded();
        this.listenForReplicaProgress();
        this.listenForReplicatedData();
    }
}
