/**
 * Handle global settings
 * **/


export default {
    streaming: ['hls', 'torrent'],
    resolutions: {
        available: [
            '720p', '1080p', '2160p'
        ]
    },
    gateways: [
        'https://vps1.phillm.net',
        'https://vps2.phillm.net',
        'https://gateway.ipfs.io',
        'https://gateway.pinata.cloud',
        'http://localhost:9090',
        'https://ipfs.infura.io',
        'https://cloudflare-ipfs.com',
        'https://cf-ipfs.com'
    ],
    subs: {
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
    }
};


