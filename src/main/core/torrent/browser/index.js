const WebTorrent = require('webtorrent')
const webtorrentHealth = require('webtorrent-health')
const parseTorrent = require('parse-torrent');
const EventEmitter = require('events')
const log = require('logplease').create('WEBTORRENT')
const {calcChunkPercent, selectBiggestFile} = require('../helper')
const {
    MIN_SIZE_LOADED,
    TORRENT_TRACKERS,
    MAX_NUM_CONNECTIONS
} = require(`../settings`);

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
        //Stopped
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
            {trackers: TORRENT_TRACKERS}
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
            maxConns: MAX_NUM_CONNECTIONS
        });

        this.client.add(torrent, {
            announce: [
                ...TORRENT_TRACKERS,
                ...[
                    'wss://tracker.openwebtorrent.com',
                    'wss://tracker.btorrent.xyz',
                    'wss://tracker.fastcast.nz',
                    'wss://tracker.webtorrent.io'
                ]
            ]
        }, (_torrent) => {
            // Find the biggest file = movie
            let selectedFile = selectBiggestFile(_torrent.files)
            this.flix = _torrent // Flix = torrent object
            this.flix.fileSize = selectedFile.length;

            log.info('Initializing torrent')
            selectedFile.renderTo(videoRef, {autoPlay: true})
            _torrent.on('download', (b) =>
                this.checkLoadingProgress(_torrent, b)
            )
        })

        return this;

    }
}