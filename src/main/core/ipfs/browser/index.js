const IPFS = require('ipfs');
const defaultConf = require('../settings')
const log = require('logplease').create('IPFS')

const startRunning = async (repo) => {
    const defaultIPFS = {
        ...defaultConf(), ...{
            "Bootstrap": [
                '/ip4/34.209.228.155/tcp/4001/p2p/QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg',
                '/ip4/144.172.69.157/tcp/4001/p2p/QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g',
                '/ip4/185.215.224.79/tcp/4001/p2p/12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF',
                '/ip4/185.215.227.40/tcp/4001/p2p/12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw'
            ],
            "Addresses": {
                "Swarm": [
                    '/ip4/0.0.0.0/tcp/4010',
                    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                    '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
                ]
            }
        }
    };

    const conf = Object.assign({repo}, defaultIPFS);
    const isInstance = await IPFS.create({
        config: conf,
        start: true,
        preload: {
            enabled: false
        },
        EXPERIMENTAL: {
            pubsub: true,
        },

    })

    const ipfsID = await isInstance.id()
    log.info('Running ipfs id', ipfsID.id)
    return isInstance
}

module.exports = {
    start: startRunning
}