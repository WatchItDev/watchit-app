/***
 * Opens a streaming torrent client
 * @author gmena
 */
const path = require('path')
const log = require('electron-log')
const peerflix = require('peerflix');
const readTorrent = require('read-torrent');
const parseTorrent = require('parse-torrent');
const webtorrentHealth = require('webtorrent-health')
const TorrentConf = require(`${__dirname}/settings/torrent`);
const {ROOT_TMP_FOLDER} = require(`${__dirname}/settings/`)
const TORRENT_FILE_READ_TIMEOUT = 30 * 1000

module.exports = class TorrentStreamer {
    constructor() {
        this.flix = null;
        this.loadedTimeout = null;
        this.stopped = false;
    }

    stop(cb) {
        /**Stop torrent streaming
         * @param {function} callback
         * */
        //Loading timeout stop
        if (this.loadedTimeout) {
            log.warn('Removed stream timeout');
            clearTimeout(this.loadedTimeout)
        }

        //If flix
        if (this.flix) {
            //Destroy peers
            this.flix.destroy();
            this.flix.server.close(function () {
                log.warn('Flix destroyed');
                delete this.flix;
            }.bind(this));
        }

        //Stopped
        this.stopped = true;
        typeof cb === 'function'
        && cb.call(this);

    }

    checkLoadingProgress(flix, {onReady, onProgress}) {
        /**Check for progress in torrent download
         * @param {object} flix
         * @param {string} href
         * @param {function} onReady
         * @param {function} onProgress
         * @return void
         * */
        const total = flix.fileSize;
        const swarm = flix.swarm;
        const downloaded = swarm.downloaded;
        let state = 'Connecting';

        // There's a minimum size before we start playing the video.
        const targetLoadedSize = TorrentConf.MIN_SIZE_LOADED > total ? total : TorrentConf.MIN_SIZE_LOADED;
        const targetLoadedPercent = TorrentConf.MIN_PERCENTAGE_LOADED * total / 100.0;
        const targetLoaded = Math.max(targetLoadedPercent, targetLoadedSize);
        const percent = (downloaded / targetLoaded * 100.0).toFixed(0);

        if ((downloaded > TorrentConf.MIN_SIZE_LOADED || swarm.cachedDownload > TorrentConf.MIN_SIZE_LOADED)
        ) {
            if (typeof onReady === 'function') {
                onReady.call(this, flix.href, flix);
            }
        } else {
            if (downloaded || swarm.piecesGot > 0) {
                state = 'Downloading';
            } else if (swarm.wires.length) {
                state = 'Starting Download';
            }

            typeof onProgress === 'function' ? onProgress.call(this, flix, percent, state) : null;
            this.loadedTimeout = setTimeout(function () {
                this.checkLoadingProgress(flix, {onReady, onProgress})
            }.bind(this), 500);
        }

    }

    async getHealth(hash, i) {
        let {peers, seeds} = await webtorrentHealth(
            parseTorrent.toMagnetURI({infoHash: hash.toLowerCase()}),
            {trackers: TorrentConf.TORRENT_TRACKERS}
        )

        return {peers, seeds, index: i}
    }

    play(torrent, {onReady, onProgress, onError}) {
        /** Start playing torrent
         * @param {string} torrent
         * @param {function} onReady
         * @param {function} onProgress
         * @param {function} onError
         * @return object
         * * */
        //Reset stopped on each new play
        this.stopped = false;
        //Handle remote torrent
        readTorrent(torrent, {
            timeout: TORRENT_FILE_READ_TIMEOUT
        }, (err, torrent) => {
            if (err || !torrent) {
                onError(err);
                return;
            }

            //Don't connect, if stop was triggered
            if (this.stopped) {
                log.info('Stream stopped');
                return;
            }

            // Streamer
            // Create a unique file to cache the video (with a microtimestamp) to prevent read conflicts
            let tmpFile, tmpFilename = torrent.infoHash;
            tmpFilename = tmpFilename.replace(/([^a-zA-Z0-9-_])/g, '_');
            tmpFile = path.join(ROOT_TMP_FOLDER, tmpFilename);

            //Active
            //Starting streaming
            //Streamer!!
            this.flix = peerflix(torrent, {
                // Set the custom temp file
                path: tmpFile,
                dht: true,
                tracker: true,
                verify: true,
                //port: 554,
                trackers: TorrentConf.TORRENT_TRACKERS,
                buffer: (1.5 * 1024 * 1024).toString(),
                tmp: ROOT_TMP_FOLDER,
                name: torrent.infoHash,
                connections: TorrentConf.MAX_NUM_CONNECTIONS
            });

            this.flix.swarm.piecesGot = 0;
            this.flix.swarm.cachedDownload = 0;
            this.flix.fileSize = 0; // The file selected size
            this.flix.pathToFile = null; // The path to the file
            this.flix.href = null; // The href link

            this.flix.on('verify', () => {
                if (this.flix) {
                    this.flix.swarm.piecesGot += 1;
                }
            });

            //Server listening
            this.flix.server.on('listening', () => {
                if (this.flix) {
                    let selectedFile = this.flix.torrent.files.reduce(function (biggest, file) {
                        return biggest.length > file.length ? biggest : file;
                    });

                    //Additional attributes
                    this.flix.hash = tmpFilename;
                    this.flix.fileSize = selectedFile.length;
                    this.flix.pathToFile = tmpFile + '/' + selectedFile.path;
                    this.flix.href = 'http://127.0.0.1:' + this.flix.server.address().port + '/';

                    //Clear old timeout
                    this.loadedTimeout ? clearTimeout(this.loadedTimeout) : null;
                    this.checkLoadingProgress(this.flix, {onReady, onProgress});
                }
            });

            // piecesGot before ready means the cache we already have
            this.flix.on('ready', () => {
                if (this.flix) {
                    this.flix.swarm.cachedDownload = this.flix.swarm.piecesGot
                        * (this.flix.torrent.pieceLength || 0);
                }
            });

        });

        //Return reference to Streamer
        return this;
    }

}

