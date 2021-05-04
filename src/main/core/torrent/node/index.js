const WebTorrent = require('webtorrent-hybrid')
const webtorrentHealth = require('webtorrent-health')
const parseTorrent = require('parse-torrent');
const readTorrent = require('read-torrent');
const EventEmitter = require('events')
const log = require('logplease').create('WEBTORRENT')
const {calcChunkPercent, selectBiggestFile, deselectFiles} = require('../helper')
const {
    MIN_SIZE_LOADED,
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
        if (this.flix)
            this.flix.destroy(cb);
    }

    checkLoadingProgress(torrent) {
        /**Check for progress in torrent download
         * @param {object} flix
         * @param {string} href
         * @return void
         * */

        if (this.stopped || this.started) return; // Avoid keep loading
        const downloaded = torrent.downloaded
        const percent = calcChunkPercent(downloaded, this.flix.fileSize);
        const readyToShow = torrent.downloaded > MIN_SIZE_LOADED

        if (readyToShow) {
            log.info('Starting stream')
            this.started = true;
            this.emit('start', {})
        } else {
            this.emit('progress', torrent,
                percent, 'Downloading'
            );
        }
    }


    async getHealth(hash, i) {
        let {peers, seeds} = await webtorrentHealth(
            parseTorrent.toMagnetURI({infoHash: hash.toLowerCase()}),
            {trackers: TORRENT_WEB_TRACKERS}
        )

        return {peers, seeds, index: i}
    }



    play(torrent, {videoRef}) {
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

                //Don't connect, if stop was triggered
                if (this.stopped) {
                    log.info('Stream stopped');
                    return;
                }

                log.warn('Fetching torrent')
                this.client.add(torrent, {
                    announce: TORRENT_WEB_TRACKERS
                }, (_torrent) => {
                    log.info('Initializing torrent')
                    _torrent.on('wire', (_, r) => log.info('WebTorrent peer connected:', r))
                    _torrent.on('download', (b) => this.checkLoadingProgress(_torrent, b))

                    const selectedFile = selectBiggestFile(_torrent.files)
                    this.flix = _torrent // Flix = torrent object
                    this.flix.fileSize = selectedFile.length;

                    // selectedFile.renderTo(videoRef, {autoPlay: true})
                    // const server = torrent.createServer()
                    // server.listen('7001')


                })
            })
        } catch (e) {
            log.error('Error resolving torrent')
            this.emit('error', e)
        }

        return this;

    }
}