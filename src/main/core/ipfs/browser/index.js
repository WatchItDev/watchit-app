const IPFS = require('ipfs');
const defaultConf = require('../settings')
const log = require('logplease').create('IPFS')

const startRunning = async (repo) => {
    const defaultIPFS = {
        ...defaultConf(), ...{
            "Bootstrap": [
                '/dns4/ec2-34-209-228-155.us-west-2.compute.amazonaws.com/tcp/4002/wss/p2p/QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg',
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
        preload: {enabled: false},
        EXPERIMENTAL: {pubsub: true,},
    })

    const ipfsID = await isInstance.id()
    log.info('Running ipfs id', ipfsID.id)
    return isInstance
}

module.exports = {
    start: startRunning
}