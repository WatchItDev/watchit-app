const webTorrentHealth = require('webtorrent-health')
const parseTorrent = require('parse-torrent')
const readTorrent = require('read-torrent')
const prettyBytes = require('pretty-bytes')
const log = require('logplease').create('TORRENT')
const { selectBiggestFile } = require('./helper')
const {
  STREAM_PORT,
  STUN_TURN,
  TORRENT_TRACKERS,
  MAX_NUM_CONNECTIONS,
  TORRENT_FILE_READ_TIMEOUT
} = require('./settings')

const ParentStreamer = require(
  // Handle multiple envs for browser or node package
  typeof process === 'undefined' ? './browser' : './node'
)

// Trackers for web torrent
const TORRENT_WEB_TRACKERS = [
  ...TORRENT_TRACKERS,
  ...[
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.vps1.phillm.net:8000'
    // 'wss://tracker.btorrent.xyz',
    // 'wss://tracker.fastcast.nz',
    // 'wss://tracker.webtorrent.io',
    // 'wss://tracker.sloppyta.co',

  ]
]

module.exports = class TorrentStreamer extends ParentStreamer {
  constructor (props) {
    super(props)
    this.flix = null
    this.client = null
    this.stopped = false
    this.started = false
    this.mime = 'video/mp4'
  }

  get [Symbol.toStringTag] () {
    return 'BrowserTorrentStreaming'
  }

  static getInstance () {
    return new TorrentStreamer()
  }

  stop (cb) {
    /** Stop torrent streaming
     * @param {function} callback
     * */
    // Loading timeout stop
    log.warn('Flix destroyed')
    this.stopped = true
    this.started = false
    if (this.flix) this.flix.destroy(cb)
    if (this.client) this.client.destroy()
    this.flix = this.client = null
  }

  checkLoadingProgress (torrent) {
    /** Check for progress in torrent download
     * @param {object} flix
     * @param {string} href
     * @return void
     * */

    if (this.stopped || this.started) return // Avoid keep loading
    const downloaded = torrent.downloaded // Current downloaded size
    const chunk = this.flix.fileSize * 0.05 // Wait for threshold
    const progress = (downloaded / chunk) * 100

    if (downloaded > chunk) {
      log.info('Starting stream')
      return this.onReady()
    }

    // Progress on download
    this.emit('progress',
      torrent, progress,
      progress === 0 ? 'Starting' : 'Downloading'
    )
  }

  async getHealth (hash, i) {
    const { peers, seeds } = await webTorrentHealth(
      parseTorrent.toMagnetURI({ infoHash: hash.toLowerCase() }),
      { trackers: TORRENT_WEB_TRACKERS }
    )

    return { peers, seeds, index: i }
  }

  get stats () {
    return {
      dSpeed: `${prettyBytes(this.flix.downloadSpeed)}/s`, // Download speed
      uSpeed: `${prettyBytes(this.flix.uploadSpeed)}/s`, // Upload speed
      dLoaded: `${prettyBytes(this.flix.downloaded)}`, // Downloaded
      fSize: `${prettyBytes(this.flix.fileSize)}`, // File size
      aPeers: this.flix.numPeers // Active peers
    }
  }

  play (torrent, { videoRef } = {}) {
    /** Start playing torrent
     * @param {string} torrent
     * @return object
     * * */
    // Reset stopped on each new play
    this.stopped = false
    // Handle remote torrent
    this.client = this._client({
      maxConns: MAX_NUM_CONNECTIONS,
      tracker: { rtcConfig: { iceServers: STUN_TURN } }
    })

    this.client.on('error', (e) => {
      log.error('WebTorrent client error:', e)
      this.emit('error', e)
    })

    try {
      readTorrent(torrent, {
        timeout: TORRENT_FILE_READ_TIMEOUT
      }, (err, torrent) => {
        if (err || !torrent) {
          this.emit('error', err)
          return
        }

        // Don't connect, if stop was triggered
        if (this.stopped) {
          log.info('Stream stopped')
          return
        }

        log.warn('Fetching torrent')
        this.client.add(torrent, {
          announce: TORRENT_WEB_TRACKERS
        }, async (_torrent) => {
          log.info(`Initializing torrent client ${this.client.peerId}`)
          // this.emit('progress', torrent, 0, 'Peering')
          const selectedFile = selectBiggestFile(_torrent.files)
          const fileIndex = _torrent.files.indexOf(selectedFile)
          _torrent.on('download', (b) => this.checkLoadingProgress(_torrent, b))
          _torrent.on('wire', (_, r) => log.info('WebTorrent peer connected:', r))

          // Handle torrent object
          this.flix = _torrent // Flix = torrent object
          this.flix.file = selectedFile
          this.flix.videoRef = videoRef
          this.flix.fileSize = selectedFile.length
          await this.runServer(STREAM_PORT, fileIndex) // Run server in appointed port
        })
      })
    } catch (e) {
      log.error('Error resolving torrent')
      this.emit('error', e)
    }

    return this
  }
}
