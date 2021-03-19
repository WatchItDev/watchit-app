const hls = require('hls.js')
const log = require('electron-log')
const conf = require('./settings/hls')
const EventEmitter = require('events')

module.exports = class HLSStreamer extends EventEmitter {

    constructor(props) {
        super(props);
        this.mime = "application/x-mpegURL"

    }

    onError(event, data) {
        /***
         * Handle error on HLS streaming
         * @param {object} event
         * @param {object} data
         */
        if (data.fatal) {
            switch (data.type) {
                case this.ErrorTypes.NETWORK_ERROR:
                    // try to recover network error
                    log.warn('fatal network error encountered, try to recover');
                    this.startLoad();
                    break;
                case this.ErrorTypes.MEDIA_ERROR:
                    log.warn('fatal media error encountered, try to recover');
                    this.recoverMediaError();
                    break;
                default:
                    // cannot recover
                    this.destroy();
                    this.emit('error')
                    break;
            }
        }
    }

    play(uri, {videoRef}) {
        /***
         * Start HLS streaming play
         * @param {object} videoRef
         * @param {function} onReady
         */
            // Check for native play
        const nativePlay = videoRef.canPlayType(
            'application/vnd.apple.mpegurl'
            )

        if (hls.isSupported()) {
            log.warn(`Starting hls: ${uri}`)
            const hlsStreamer = new hls(conf)
            hlsStreamer.loadSource(uri);
            // When media attached then try to play streaming!!
            hlsStreamer.on(hls.Events.ERROR, this.onError.bind(this))
            hlsStreamer.on(hls.Events.MEDIA_ATTACHED, () => {
                log.info('Media attached')
                // this.emit('ready', uri, this.mime)
            })

            hlsStreamer.on(hls.Events.MANIFEST_PARSED, (e, n) => {
                log.info('m3u8 manifest loaded')
                hlsStreamer.attachMedia(videoRef)
                this.emitStart(n)
            })

        } else if (nativePlay) {
            this.emit('ready', uri)
        }

        return this
    }

    quality(n) {
        /**
         * Process qualities to player
         * @param {object} n
         * @return {object}
         */
        const q = n.levels.map((l) => l.height)
        return {
            quality: {
                // this ensures Plyr to use Hls to update quality level
                forced: true, default: q[0], options: q,
                onChange: (e) => this.updateQuality(hls, n, e),
            }
        }
    }

    subs() {
        return {}
    }

    emitStart(n) {
        // Add new qualities to option
        this.emit('start', {
            ...this.quality(n),
            ...this.subs(n)
        })
    }

    updateQuality(h, n, newQuality) {
        h.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                console.log("Found quality match with " + newQuality);
                h.currentLevel = levelIndex;
            }
        });
    }

    stop() {
        //Dummy stop
    }

}