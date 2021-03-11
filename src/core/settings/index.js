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
    // 'https://vps1.phillm.net',
    // 'https://vps2.phillm.net',
    // 'https://gateway.ipfs.io',
    // 'https://gateway.pinata.cloud',
    'http://localhost:9090',
    // 'https://ipfs.infura.io',
    // 'https://cloudflare-ipfs.com',
    // 'https://cf-ipfs.com'
]

export default Settings;

