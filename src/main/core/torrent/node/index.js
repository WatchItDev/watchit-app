const WebTorrent = require('webtorrent-hybrid')
const webTorrentHealth = require('webtorrent-health')
const parseTorrent = require('parse-torrent');
const readTorrent = require('read-torrent');
const EventEmitter = require('events')
const prettyBytes = require('pretty-bytes')
const log = require('logplease').create('TORRENT')
const {selectBiggestFile} = require('../helper')
const {
    STREAM_PORT,
    TORRENT_TRACKERS,
    MAX_NUM_CONNECTIONS,
    TORRENT_FILE_READ_TIMEOUT
} = require(`../settings`);

// Trackers for web torrent
const TORRENT_WEB_TRACKERS = [
    ...TORRENT_TRACKERS,
    ...[
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.vps1.phillm.net:8000',
        // 'wss://tracker.btorrent.xyz',
        // 'wss://tracker.fastcast.nz',
        // 'wss://tracker.webtorrent.io',
        // 'wss://tracker.sloppyta.co',

    ]
]


module.exports = class BrowserStreamer extends EventEmitter {
    constructor(props) {
        super(props)
        this.flix = null;
        this.client = null;
        this.stopped = false;
        this.started = false;
        this.mime = "video/mp4"
    }

    get [Symbol.toStringTag]() {
        return 'BrowserTorrentStreaming'
    }

    stop(cb) {
        /**Stop torrent streaming
         * @param {function} callback
         * */
        //Loading timeout stop
        log.warn('Flix destroyed');
        this.stopped = true;
        this.started = false;
        if (this.flix) this.flix.destroy(cb);
        if (this.client) this.client.destroy();
    }

    checkLoadingProgress(torrent) {
        /**Check for progress in torrent download
         * @param {object} flix
         * @param {string} href
         * @return void
         * */

        if (this.stopped || this.started) return; // Avoid keep loading
        const downloaded = torrent.downloaded // Current downloaded size
        const chunk = this.flix.fileSize * .05 // Wait for threshold
        const progress = (downloaded / chunk) * 100

        if (downloaded > chunk) {
            log.info('Starting stream')
            return this.onReady();
        }

        // Progress on download
        this.emit('progress',
            torrent, progress,
            progress === 0 ? 'Starting' : 'Downloading'
        );

    }


    async getHealth(hash, i) {
        let {peers, seeds} = await webTorrentHealth(
            parseTorrent.toMagnetURI({infoHash: hash.toLowerCase()}),
            {trackers: TORRENT_WEB_TRACKERS}
        )

        return {peers, seeds, index: i}
    }

    runServer(port, fileIndex) {
        if (this.flix) {
            log.info('Starting server')
            this.flix.href = `http://127.0.0.1:${port}/${fileIndex}`;
            this.flix.createServer(() => {
                // Process request here!!
                // Isn't needed for now
            }).listen(port)
        }
    }

    onReady() {
        this.started = true;
        this.emit('ready', this.flix.href, this.mime, this);
        this.emit('start', {});
    }

    get stats() {
        return {
            dSpeed: `${prettyBytes(this.flix.downloadSpeed)}/s`, // Download speed
            uSpeed: `${prettyBytes(this.flix.uploadSpeed)}/s`, // Upload speed
            dLoaded: `${prettyBytes(this.flix.downloaded)}`, // Downloaded
            fSize: `${prettyBytes(this.flix.fileSize)}`, // File size
            aPeers: this.flix.numPeers // Active peers
        }
    }

    play(torrent) {
        /** Start playing torrent
         * @param {string} torrent
         * @return object
         * * */
        //Reset stopped on each new play
        this.stopped = false;
        //Handle remote torrent
        this.client = new WebTorrent({
            maxConns: MAX_NUM_CONNECTIONS,
            trackers: true, dht: true
        });

        this.client.on('error', (e) => {
            log.error('WebTorrent client error:', e)
            this.emit('error', e)
        })

        try {
            readTorrent(torrent, {
                timeout: TORRENT_FILE_READ_TIMEOUT
            }, (err, torrent) => {
                if (err || !torrent) {
                    this.emit('error', err);
                    return;
                }

                // Don't connect, if stop was triggered
                if (this.stopped) {
                    log.info('Stream stopped');
                    return;
                }

                log.warn('Fetching torrent')
                this.client.add(torrent, {
                    announce: TORRENT_WEB_TRACKERS
                }, (_torrent) => {
                    log.info('Initializing torrent')
                    const selectedFile = selectBiggestFile(_torrent.files)
                    const fileIndex = _torrent.files.indexOf(selectedFile)
                    _torrent.on('wire', (_, r) => log.info('WebTorrent peer connected:', r))
                    _torrent.on('download', (b) => this.checkLoadingProgress(_torrent, b))
                    _torrent.on('noPeers', () => this.emit('progress', torrent, 0, 'Tracking'))

                    // Handle torrent object
                    this.flix = _torrent // Flix = torrent object
                    this.flix.fileSize = selectedFile.length;
                    this.runServer(STREAM_PORT, fileIndex); // Run server in appointed port
                })
            })
        } catch (e) {
            log.error('Error resolving torrent')
            this.emit('error', e)
        }

        return this;

    }
}