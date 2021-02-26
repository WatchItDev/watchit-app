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
    'orbit-partial-progress',
    'party-rock',
    'orbit-peer',
    'orbit-error',
    'orbit-ready',
    'orbit-db-ready',
    'orbit-db-loaded',
    'orbit-progress',
    'orbit-replicated'
]

module.exports = class Ingest {
    constructor() {
        this.p = new LinvoDB(DB, MOVIES_SCHEMA)
        // Search Indexer Movie
        this.events = {
            start: null, peer: null, ready: null, done: null,
            loading: null, progress: null, replicated: null,
            partialProgress: null, error: null,
            loadingCache: null, bc: null
        }
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

    flush() {
        /**
         * Kill all this shit XD
         * */
        ipcRenderer.send(
            'orbit-flush'
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
        ipcRenderer.send('orbit-seed')
        return this;
    }

    emitStart() {
        /***
         * Init signal to start node running
         */
        ipcRenderer.send('start-orbit');
        return this;
    }

    stopEvents() {
        /***
         * Remove all events assigned to ipc
         */
        Object.keys(this.events).forEach(
            (i) => this.events[i] = null
        )
        return this;
    }

    listenForNewPeer() {
        /***
         * New peers interception and caching for stats
         */
        ipcRenderer.on('orbit-peer', (e, p) => {
            log.info('New peer', p);
            Auth.addToStorage({'peers': p});
            this._loopEvent('peer', p)

        })
    }

    listenForPartialProgress() {
        /***
         * Partial replication progress %
         */
        ipcRenderer.on('orbit-partial-progress', (e, c, p) => {
            this._loopEvent('progress', c, p)
        })
    }

    listenForPartyRock() {
        /***
         * Cannot connect or any invalid key provided
         */
        ipcRenderer.on('party-rock', (e, m) => {
            this._loopEvent('bc', m)
        })
    }

    listenForError() {
        /***
         * Any error in node
         */
        ipcRenderer.on('party-rock', (e, m) => {
            this._loopEvent('bc', m)

        })
    }

    listenForReady() {
        /**
         * Trigger event before node get ready tu run
         * could be used to clear storage or data previous to run app
         */
        ipcRenderer.on('orbit-ready', (e, c) => {
            this._loopEvent('start', c)

        })
    }

    listenForStartRunning() {
        /***
         * Trigger event when the node is ready to launch app
         * this event goes after ready event
         */
        ipcRenderer.on('orbit-db-ready', (e, c) => {
            this._loopEvent('ready', c)

        })
    }

    listenForDbLoaded() {
        /***
         * Trigger event when all db are synced
         */
        ipcRenderer.on('orbit-db-loaded', (e, c) => {
            this._loopEvent('done', c)

        })
    }

    listenForReplicaProgress() {
        /***
         * Replicate process event
         */
        ipcRenderer.on('orbit-progress', (e, total) => {
            this._loopEvent('progress', total)

        })
    }

    listerForReplicatedData() {
        /***
         * Trigger event when new data its replicated
         */
        ipcRenderer.on('orbit-replicated', async (e, collection) => {
            log.info('LOADING FROM NETWORK');
            log.info(collection[collection.length - 1]['_id']);
            log.info(collection[0]['_id']);
            this.p.insert(collection, (e, n) => console.log(`Inserted ${n.length}`)); // Save in local
            this._loopEvent('replicated')
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
