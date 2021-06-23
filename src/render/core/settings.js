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
  },
  styles: {
    devices: {
      mobileS: '(min-width: 320px)',
      mobileM: '(min-width: 375px)',
      mobileL: '(min-width: 425px)',
      tablet: '(min-width: 768px)',
      laptop: '(min-width: 992px)',
      laptopL: '(min-width: 1440px)',
      desktop: '(min-width: 1900px)',
      desktopL: '(min-width: 2560px)'
    },
    colors: {
      primary: '#03a9f3',
      danger: '#E57373',
      dangerDark: '#F44336',
      success: '#81C784',
      successDark: '#4CAF50',
      warning: '#ca6005',
      warningDark: '#ff9800',
      default: 'rgba(0,0,0,0.5)'
    }
  }
}
