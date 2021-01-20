const Auth = require('./auth');
const ipcRenderer = require('electron').ipcRenderer;
const LinvoDB = require("linvodb3");
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
            partialProgress: null, error: null, loadingCache: null,
            bc: null, ba: null, bp: null
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
         * Kill all this shit
         * */
        ipcRenderer.send(
            'orbit-flush'
        );
    }

    stopIpcEvents(ipcListeners = []) {
        (ipcListeners || IPC_LISTENERS).forEach((l) => {
            console.log('Cleaning:', l);
            ipcRenderer.removeAllListeners(l)
        })

        return this;
    }

    startSeed() {
        console.log('Run Seed');
        ipcRenderer.send('orbit-seed')
        return this;
    }

    stopEvents() {
        Object.keys(this.events).forEach(
            (i) => this.events[i] = null
        )
        return this;
    }

    load() {
        // Clean old listeners first
        this.stopIpcEvents();
        ipcRenderer.send('start-orbit');
        ipcRenderer.on('orbit-partial-progress', (e, c, p) => {
            this._loopEvent('progress', c, p)

        }).on('party-rock', (e, m) => {
            this._loopEvent('bc', m)

        }).on('orbit-peer', (e, p) => {
            console.log('New peer', p);
            Auth.addToStorage({'peers': p});
            this._loopEvent('peer', p)

        }).on('orbit-error', (e, m) => {
            this._loopEvent('error', m)

        }).on('orbit-ready', (e, c) => {
            this._loopEvent('start', c)

        }).on('orbit-db-ready', (e, c) => {
            this._loopEvent('ready', c)

        }).on('orbit-db-loaded', (e, c) => {
            this._loopEvent('done', c)

        }).on('orbit-progress', (e, total) => {
            this._loopEvent('progress', total)

        }).on('orbit-replicated', async (e, collection) => {
            console.info('LOADING FROM NETWORK');
            console.log(collection[collection.length -1]['_id']);
            console.log(collection[0]['_id']);
            this.p.insert(collection, (e, n) => console.log(`Inserted ${n.length}`)); // Save in local
            this._loopEvent('replicated')
        })
    }
}
