const IPFS = require('ipfs');
const log = require('logplease').create('IPFS')

const defaultIPFS = {
    "Discovery": {"MDNS": {"Enabled": true, "Interval": 10}},
    "Bootstrap": [
        "/dns4/watchitapp.site/tcp/4002/wss/p2p/QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg",
        "/dns4/direct.vps1.phillm.net/tcp/4002/wss/p2p/QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g",
        "/dns4/direct.vps2.phillm.net/tcp/4002/wss/p2p/12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF",
        "/dns4/direct.vps3.phillm.net/tcp/4002/wss/p2p/12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw",
    ],
    "Addresses": {
        "Swarm": [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
        ]
    }
}

const startRunning = async (repo) => {

    const conf = Object.assign({repo}, defaultIPFS);
    const isInstance = await IPFS.create({
        config: conf, preload: {enabled: false},
        EXPERIMENTAL: {pubsub: true, ipnsPubsub: true, dht: true},
        libp2p: {config: {dht: {enabled: true}}},
    })

    try {
        await isInstance.start();
        const ipfsID = await isInstance.id()
        ipfsID.kill = async () => isInstance.stop(); // Alias to stop
        log.info('Running ipfs id', ipfsID.id)
        return isInstance
    } catch (e) {
        console.log(e);
        await isInstance.stop().catch(()=> log.error('Error trying to stop node'));
        log.error('Fail on start: cleanup node')
        return false;
    }

}

module.exports = {
    start: startRunning
}