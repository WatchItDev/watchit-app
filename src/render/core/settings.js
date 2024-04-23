/**
 * Handle global settings
 * **/

export default {
  streaming: ['hls'],
  gateways: () => {
    // const keyFile = key.readFromStorage() || {}
    // const node = 'node' in keyFile && keyFile.node ? keyFile.node : null
    const port = '9090'// null ? '8080' : '9090'

    return [
      // 'https://vps1.phillm.net',
      // 'https://vps2.phillm.net',
      // 'https://vps3.phillm.net',
      // 'https://watchit.mypinata.cloud',
      'https://ipfs.filebase.io',
      'https://gateway.ipfs.io',
      // 'https://ipfs.io',
      ...process.env.RUNTIME !== 'web'
        ? [`http://localhost:${port}`]
        : []
    ]
  },
  subs: {
    hash: {
      spanish: 'es',
      english: 'en'
    },
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
      name: 'StreamMiddleware ',
      signal: 'stream-middleware'
    }]
  },
  styles: {
    devices: {
      mobileS: 'only screen and (min-width: 320px)',
      mobileM: 'only screen and (min-width: 375px)',
      mobileL: 'only screen and (min-width: 425px)',
      tablet: 'only screen and (min-width: 768px)',
      laptop: 'only screen and (min-width: 992px)',
      laptopAndLow: 'only screen and (max-width: 992px)',
      laptopL: 'only screen and (min-width: 1440px)',
      desktop: 'only screen and (min-width: 1900px)',
      desktopL: 'only screen and (min-width: 2560px)'
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
