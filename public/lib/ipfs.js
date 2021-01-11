const IPFS = require('ipfs');
const libp2p = require('./p2p');
const ipfsConf = require('./settings/ipfs');
let interval = null;


module.exports = async (inDev, repo) => {
    const CONF = Object.assign({libp2p}, {repo}, ipfsConf);
    const isInstance = await IPFS.create(CONF)

    if (inDev) { // Create stats interval if dev
        if (interval || !isInstance) clearInterval(interval);
        interval = setInterval(async () => {
            const id = await isInstance.id()
            const swap = await isInstance.bitswap.stat()
            const peers = await isInstance.swarm.peers()
            console.log('\nMyPeer: ', id.id);
            console.log('PeersConnected: ', peers.map((d) => d.peer));
            console.log('PeersSharing: ', swap.peers);
            console.log('WantList: ', swap.wantlist);
            console.log('BlocksReceived: ', swap.blocksReceived.toNumber());
            console.log('Data Received: ', swap.dataReceived.toNumber())
            console.log('Data Sent: ', swap.dataSent.toNumber())
            console.log('Block Sent: ', swap.blocksSent.toNumber(), '\n')
        }, 30 * 1000)
    }
    isInstance.interval = interval
    return isInstance
}

