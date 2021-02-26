const EventEmitter = require('events')
const Auth = require('./broker');
const ipcRenderer = require('electron').ipcRenderer;
const LinvoDB = require("linvodb3");
const log = require('electron-log')
LinvoDB.defaults.store = {db: require("leveldown")};
LinvoDB.defaults.autoIndexing = false;
LinvoDB.dbPath = Auth.init.db

// ipcRender listeners
const DB = 'wt'
const MOVIES_SCHEMA = {
    _id: {type: String, index: true, unique: false},
    title: {type: String, index: true},
    year: {type: Number, index: true},
    runtime: {type: Number, index: true},
    genres: {type: [String], index: true},
    date_uploaded_unix: {type: Number, index: true}
}

const IPC_LISTENERS = [
    'node-chaos',
    'node-peer',
    'node-error',
    'node-ready',
    'node-db-ready',
    'node-db-loaded',
    'node-progress',
    'node-replicated',
    'node-partial-progress'
]

module.exports = class Ingest extends EventEmitter {
    constructor() {
        super()
        this.p = new LinvoDB(
            DB, MOVIES_SCHEMA
        )
    }

    flush() {
        /**
         * Kill all this shit XD
         * */
        ipcRenderer.send(
            'node-flush'
        );
    }

    stopIpcEvents(ipcListeners = []) {
        /***
         * Clear ipc electron events to avoid
         * over declarative events
         */
        (ipcListeners || IPC_LISTENERS).forEach((l) => {
            log.info('Cleaning:', l);
            ipcRenderer.removeAllListeners(l)
        })

        return this;
    }

    startSeed() {
        /***
         * Run app as seed mode
         */
        log.info('Run Seed');
        ipcRenderer.send('node-seed')
        return this;
    }

    emitStart() {
        /***
         * Init signal to start node running
         */
        ipcRenderer.send('node-start');
        return this;
    }


    listenForNewPeer() {
        /***
         * New peers interception and caching for stats
         */
        ipcRenderer.on('node-peer', (e, p) => {
            log.info('New peer', p);
            Auth.addToStorage({'peers': p});
            this._loopEvent('peer', p)

        })
    }

    listenForPartialProgress() {
        /***
         * Partial replication progress %
         */
        ipcRenderer.on('node-partial-progress', (e, c, p) => {
            this._loopEvent('progress', c, p)
        })
    }

    listenForPartyRock() {
        /***
         * Cannot connect or any invalid key provided
         */
        ipcRenderer.on('node-chaos', (e, m) => {
            this._loopEvent('bc', m)
        })
    }

    listenForError() {
        /***
         * Any error in node
         */
        ipcRenderer.on('node-error', (e, m) => {
            this.emit('bc', m)

        })
    }

    listenForReady() {
        /**
         * Trigger event before node get ready tu run
         * could be used to clear storage or data previous to run app
         */
        ipcRenderer.on('node-ready', (e, c) => {
            this.emit('start', c)

        })
    }

    listenForStartRunning() {
        /***
         * Trigger event when the node is ready to launch app
         * this event goes after ready event
         */
        ipcRenderer.on('node-db-ready', (e, c) => {
            this.emit('ready', c)

        })
    }

    listenForDbLoaded() {
        /***
         * Trigger event when all db are synced
         */
        ipcRenderer.on('node-db-loaded', (e, c) => {
            this.emit('done', c)

        })
    }

    listenForReplicaProgress() {
        /***
         * Replicate process event
         */
        ipcRenderer.on('node-step', (e, step) => {
            this.emit('progress', step)

        })
    }

    listerForReplicatedData() {
        /***
         * Trigger event when new data its replicated
         */
        ipcRenderer.on('node-replicated', async (e, collection) => {
            log.info('LOADING FROM NETWORK');
            log.info(collection[collection.length - 1]['_id']);
            log.info(collection[0]['_id']);
            this.p.insert(collection, (e, n) => console.log(`Inserted ${n.length}`)); // Save in local
            this.emit('replicated')
        })
    }

    load() {
        /***
         * This method add method to electron ipcRender
         * and serve as intermediary between render and main process
         */
        // Clean old listeners first
        this.stopIpcEvents();
        this.emitStart();
        this.listenForPartialProgress();
        this.listenForPartyRock();
        this.listenForNewPeer();
        this.listenForError();
        this.listenForReady()
        this.listenForStartRunning();
        this.listenForDbLoaded();
        this.listenForReplicaProgress();
        this.listerForReplicatedData();
    }
}
