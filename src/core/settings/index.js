/**
 * Handle global settings
 * **/
import util from 'resource/helpers/utilHelper'

const Settings = {};
let {width, height, chunkSize, chunkHeight} = util.calcScreenSize()

/////////////////////
//Resource Settings//
/////////////////////
//Avoid bad indexing
Settings.defaults = {
    width: width,
    height: height,
    chunkSize: chunkSize,
    chunkHeight: chunkHeight,
    limit: chunkSize * 5
};

//Subs conf
Settings.subs = {
    hash: {'spanish': 'es', 'english': 'en'},
    get revHash() {
        let v = Object.values(this.hash)
        let k = Object.keys(this.hash)
        return v.reduce((o, i, index) => {
            o[i] = k[index]
            return o
        }, {})
    },
    get available() {
        return Object.keys(this.hash)
    }
};

//Resolution conf
Settings.resolutions = {
    available: [
        '720p', '1080p', '2160p'
    ]
};

Settings.allowedResource = ['hls', 'torrent']
Settings.gateways = [
    'https://vps1.phillm.net',
    'https://vps2.phillm.net',
    'https://gateway.ipfs.io',
    'https://gateway.pinata.cloud',
    'http://localhost:9090',
    'https://ipfs.infura.io',
    'https://cloudflare-ipfs.com',
    'https://astyanax.io',
    'https://cf-ipfs.com',
    'https://dweb.link'
]


//Errors codes
Settings.errorCodes = {
    ERROR_IMAGE_BROKEN_LINK: 300,
    ERROR_BAD_TORRENT: 301,
    ERROR_MOVIE_PLAYER: 302,
    ERROR_BAD_SUBTITLE: 303
};

export default Settings;

