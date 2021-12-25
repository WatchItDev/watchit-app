const Plyr = require('plyr')
const HLS = require('hls.js')
const EventEmitter = require('events')
const log = require('logplease').create('HLS')
const CONF = require('./settings')
const DEFAULT_PLAYER_CONTROLS = [
  'play-large', // The large play button in the center
  'restart', // Restart playback
  'rewind', // Rewind by the seek time (default 10 seconds)
  'play', // Play/pause playback
  'fast-forward', // Fast forward by the seek time (default 10 seconds)
  'progress', // The progress bar and scrubber for playback and buffering
  'current-time', // The current time of playback
  'duration', // The full duration of the media
  'mute', // Toggle mute
  'quality', // Quality control
  'volume', // Volume control
  'captions', // Toggle captions
  'settings', // Settings menu
  'fullscreen' // Toggle fullscreen
]

module.exports = class HLSStreamer extends EventEmitter {
  constructor (props) {
    super(props)
    this.mime = 'application/x-mpegURL'
    this.hls = null
    this.player = null
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

    const nativeMime = 'application/vnd.apple.mpegURL'
    const nativePlay = videoRef.canPlayType(nativeMime)

    if (HLS.isSupported()) {
      log.warn(`Loading manifest: ${uri}`)
      this.hls = new HLS(CONF)
      this.hls.attachMedia(videoRef)
      // When media attached then try to play streaming!!
      this.hls.on(HLS.Events.ERROR, (e, d) => this.emitError(e, d))
      this.hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        log.info('Media attached')
        this.hls.loadSource(uri) // Add uri to HLS to process
        this.hls.on(HLS.Events.MANIFEST_PARSED, (e, n) => {
          log.info('m3u8 manifest loaded')
          // Add new qualities to option
          this.setup(videoRef, {
            ...this.quality(n)
            // ...this.subs(n)
          })
        })
      })
    } else if (nativePlay) {
      const newSource = document.createElement('source')
      newSource.src = uri
      newSource.type = nativeMime
      videoRef.append(newSource)
      this.setup(videoRef)
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

  setup (videoRef, options = {}) {
    log.info('Setting up player')
    const playerSettings = {
      ...{
        settings: ['captions', 'speed', 'quality'],
        controls: DEFAULT_PLAYER_CONTROLS
      },
      ...options
    }

    // Init player and wait until can play
    this.player = new Plyr(videoRef, playerSettings)
    this.player.on('error', (e) => this.emit('error', e))
    this.player.on('canplay', () => {
      // this.player.play()
      this.emit('ready')
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
    this?.player?.destroy()
    this?.hls?.destroy()
  }
}
