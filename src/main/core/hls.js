import Plyr from 'plyr'
import HLS from 'hls.js'
import EventEmitter from 'events'
import log from '@/main/logger'

const CONF = {
  manifestLoadingMaxRetry: 2,
  manifestLoadingTimeOut: 5 * 1000,
  manifestLoadingRetryDelay: 1000,
  manifestLoadingMaxRetryTimeout: 60 * 1000
}

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

export default class HLSStreamer extends EventEmitter {
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

  /**
    * Start HLS streaming play
    * @param {object} videoRef
    * @param {function} onReady
    */
  play (uri, { videoRef }) {
    const nativeMime = 'application/vnd.apple.mpegURL'
    const nativePlay = videoRef.canPlayType(nativeMime)

    if (HLS.isSupported()) {
      log.warn(`Loading manifest: ${uri}`)
      this.hls = new HLS(CONF)
      this.hls.loadSource(uri) // Add uri to HLS to process
      // When media attached then try to play streaming!!
      this.hls.on(HLS.Events.ERROR, (e, d) => this.emitError(e, d))
      this.hls.on(HLS.Events.LEVEL_SWITCHING, (data, r) => log.info(`ABR: ${r.height}p`))
      this.hls.on(HLS.Events.MEDIA_ATTACHED, () => log.info('Media attached'))
      this.hls.on(HLS.Events.MANIFEST_PARSED, (e, n) => {
        log.info('m3u8 manifest loaded')
        this.hls.attachMedia(videoRef)
        // Add new qualities to option
        this.setup(videoRef, {
          // ...this.quality(n)
          // ...this.subs(n)
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

  /**
     * Process qualities to player
     * @param {object} n
     * @return {object}
  */
  quality (n) {
    // Not quality in manifest?
    const q = n.levels.map((l) => l.height).reverse()
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

  /**
     * Handle error on HLS streaming
     * @param {object} event
     * @param {object} data
  */
  emitError (event, data) {
    if (data.fatal) {
      switch (data.type) {
        case HLS.ErrorTypes.MEDIA_ERROR:
          console.log('Fatal media error encountered, try to recover')
          this.hls.recoverMediaError()
          break
        case HLS.ErrorTypes.NETWORK_ERROR:
        default:
          // cannot recover
          this.stop()
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
        controls: DEFAULT_PLAYER_CONTROLS,
        iconUrl: 'https://cdn.plyr.io/3.6.8/plyr.svg'
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
        log.info(`Found quality match with ${newQuality}`)
        this.hls.currentLevel = levelIndex
      }
    })
  }

  stop () {
    this?.player?.stop()
    this?.player?.destroy()
    this?.hls?.destroy()
  }
}
