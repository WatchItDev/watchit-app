const HLS = require('hls.js')
const EventEmitter = require('events')
const log = require('logplease').create('HLS')
const CONF = require('./settings')

module.exports = class HLSStreamer extends EventEmitter {
  constructor (props) {
    super(props)
    this.mime = 'application/x-mpegURL'
    this.hls = null
  }

  get [Symbol.toStringTag] () {
    return 'HLSStreaming'
  }

  static getInstance () {
    return new HLSStreamer()
  }

  play (uri, { videoRef }) {
    /***
     * Start HLS streaming play
     * @param {object} videoRef
     * @param {function} onReady
     */
    // Check for native play
    const nativePlay = videoRef.canPlayType(
      'application/vnd.apple.mpegurl'
    )

    if (HLS.isSupported()) {
      log.warn(`Loading manifest: ${uri}`)
      this.hls = new HLS(CONF)
      this.hls.attachMedia(videoRef)
      // When media attached then try to play streaming!!
      this.hls.on(HLS.Events.ERROR, (e, d) => this.emitError(e, d))
      this.hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        log.info('Media attached')
        this.hls.loadSource(uri) // Add uri to HLS to process
        this.hls.on(HLS.Events.MANIFEST_PARSED, (e, n) => this.emitStart(n))
      })
    } else if (nativePlay) {
      this.emit('ready', uri)
    }

    return this
  }

  quality (n) {
    /**
     * Process qualities to player
     * @param {object} n
     * @return {object}
     */
    // Not quality in manifest?
    const q = n.levels.map((l) => l.height)
    return {
      quality: {
        // this ensures Plyr to use Hls to update quality level
        forced: true,
        default: q[0],
        options: q,
        onChange: (e) => this.updateQuality(e)
      }
    }
  }

  subs () {
    return {}
  }

  emitError (event, data) {
    /***
     * Handle error on HLS streaming
     * @param {object} event
     * @param {object} data
     */

    if (data.fatal) {
      log.info('Fail trying play movie')
      switch (data.type) {
        // case HLS.ErrorTypes.NETWORK_ERROR:
        //   // try to recover network error
        //   console.log('Fatal network error encountered, try to recover')
        //   this.hls.startLoad()
        //   break
        case HLS.ErrorTypes.MEDIA_ERROR:
          console.log('Fatal media error encountered, try to recover')
          this.hls.recoverMediaError()
          break
        case HLS.ErrorTypes.NETWORK_ERROR:
        default:
          // cannot recover
          this.hls.destroy()
          this.emit('error', data)
          break
      }
    }
  }

  emitStart () {
    log.info('m3u8 manifest loaded')
    // Add new qualities to option
    this.emit('start', {
      // ...this.quality(n),
      // ...this.subs(n)
    })
  }

  updateQuality (newQuality) {
    this.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        console.log('Found quality match with ' + newQuality)
        this.hls.currentLevel = levelIndex
      }
    })
  }

  stop () {
    this?.hls?.destroy()
  }
}
