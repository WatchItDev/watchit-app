const IPFS = require('ipfs');
const log = require('logplease').create('IPFS')

const startRunning = async (repo) => {
    const defaultIPFS = {
        "Bootstrap": [
            "/dns4/ec2-34-209-228-155.us-west-2.compute.amazonaws.com/tcp/4002/ws/p2p/QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg",
            "/dns4/direct.vps1.phillm.net/tcp/4001/p2p/QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g",
            "/dns4/direct.vps2.phillm.net/tcp/4001/p2p/12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF",
            "/dns4/direct.vps3.phillm.net/tcp/4001/p2p/12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw",
        ],
        "Addresses": {
            "Swarm": [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
            ]
        }
    }

    const conf = Object.assign({repo}, defaultIPFS);
    const isInstance = await IPFS.create({
        config: conf, start: true,
        preload: {enabled: false},
        EXPERIMENTAL: {pubsub: true, ipnsPubsub: true, dht: true},
        libp2p: {config: {dht: {enabled: true}}},
    })

    const ipfsID = await isInstance.id()
    log.info('Running ipfs id', ipfsID.id)
    return isInstance
}

module.exports = {
    start: startRunning
}