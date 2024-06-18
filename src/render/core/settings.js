/**
 * Handle global settings
 * **/

// import { Key as key } from '@main/bridge'

export default {
  streaming: ['hls'],
  gateways: () => {
    return [
      'https://ipfs.io',
      'https://storry.tv',
      "https://nftstorage.link",
      'https://4everland.io',
      'https://dweb.link',
      'https://gw.watchit.movie'
    ]
  },
  featuredCollections: [
    { cid: 'bafkreiaenzlqmc34crc7sfsr3wanvbdwovsgfgggm2am7lafeejn6orghi', label: "Public Domain" },
  ],
  subs: {
    hash: {
      spanish: 'es',
      english: 'en'
    },
    get revHash() {
      const v = Object.values(this.hash)
      const k = Object.keys(this.hash)
      return v.reduce((o, i, index) => {
        o[i] = k[index]
        return o
      }, {})
    },
    get available() {
      return Object.keys(this.hash)
    }
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
