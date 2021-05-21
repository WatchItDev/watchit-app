/**
 * Handle global settings
 * **/

export default {
  streaming: ['hls', 'torrent'],
  resolutions: {
    available: [
      '720p', '1080p', '2160p', 'HLS'
    ]
  },
  gateways: [
    'https://vps1.phillm.net',
    'https://vps2.phillm.net',
    'https://vps3.phillm.net',
    'https://gateway.ipfs.io',
    'https://gateway.pinata.cloud',
    'http://localhost:9090',
    'https://ipfs.infura.io'
    // 'https://cloudflare-ipfs.com',
    // 'https://cf-ipfs.com'
  ],
  subs: {
    hash: { spanish: 'es', english: 'en' },
    get revHash () {
      const v = Object.values(this.hash)
      const k = Object.keys(this.hash)
      return v.reduce((o, i, index) => {
        o[i] = k[index]
        return o
      }, {})
    },
    get available () {
      return Object.keys(this.hash)
    }
  },
  storage: {
    // User conf
    user: 'USER_CACHE',
    userToken: 'TOKEN_CACHE',
    userTimezone: 'USER_TIMEZONE',
    userSettingMoviesDiskClean: 'MOVIES_DISK_CLEAN',
    userSettingSubsDiskClean: 'SUBS_DISK_CLEAN',

    // Global conf
    mainNavFilters: 'FILTERS_CACHE',
    currentIndex: 'DATA_FETCHED'
  },
  broadcast: {
    middlewareList: [{
      name: 'TorrentStreamMiddleware ',
      signal: 'middleware-torrent-seed'
    }]
  }
}
