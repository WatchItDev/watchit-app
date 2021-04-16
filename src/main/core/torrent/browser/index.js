const WebTorrent = require('webtorrent')
const webtorrentHealth = require('webtorrent-health')
const parseTorrent = require('parse-torrent');
const EventEmitter = require('events')
const {
    // MIN_SIZE_LOADED,
    // MIN_PERCENTAGE_LOADED,
    TORRENT_TRACKERS,
    MAX_NUM_CONNECTIONS
} = require(`../settings`);

module.exports = class BrowserStreamer extends EventEmitter {
    constructor(props) {
        super(props)
        this.flix = null;
        this.client = null;
        this.server = null;
        this.loadedTimeout = null;
        this.stopped = false;
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


    }

    checkLoadingProgress(torrent, bytes) {
        /**Check for progress in torrent download
         * @param {object} flix
         * @param {string} href
         * @return void
         * */

        this.emit('progress',
            torrent,
            torrent.progress * 100,
            'Downloading'
        );
    }


    onDone() {

    }


    async getHealth(hash, i) {
        let {peers, seeds} = await webtorrentHealth(
            parseTorrent.toMagnetURI({infoHash: hash.toLowerCase()}),
            {trackers: TORRENT_TRACKERS}
        )

        return {peers, seeds, index: i}
    }

    play(torrent) {
        /** Start playing torrent
         * @param {string} torrent
         * @return object
         * * */
        //Reset stopped on each new play
        this.stopped = false;

        //Handle remote torrent
        this.client = new WebTorrent();
        this.client.add(torrent, {
            announce: TORRENT_TRACKERS,
            maxWebConns: MAX_NUM_CONNECTIONS,
        })

        this.client.on('torrent', (torrent) => {
            let selectedFile = torrent.files.reduce((biggest, file) => {
                return biggest.length > file.length ? biggest : file;
            });

            this.flix = torrent
            this.flix.fileSize = selectedFile.length;
            this.flix.href = ''
            this.server = torrent.createServer()
            this.server.listen()

            torrent.on('download', (b) =>
                this.checkLoadingProgress(torrent, b)
            )
        })

    }
}