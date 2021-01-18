const Ctl = require('ipfsd-ctl')
const ipfsConf = require('./settings/ipfs');
let interval = null;


module.exports = async (inDev) => {
    const isInstance = await Ctl.createController({
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: require('go-ipfs').path(),
        ipfsOptions: {config: ipfsConf()},
        disposable: true,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    console.log('Running ipfs id', id.id)

    if (inDev) { // Create stats interval if dev
        if (interval || !isInstance) clearInterval(interval);
        interval = setInterval(async () => {
            const swap = await ipfsApi.bitswap.stat()
            const peers = await ipfsApi.swarm.peers()

            console.log('PeersConnected: ', peers.map((d) => d.peer));
            console.log('PeersSharing: ', swap.peers);
            console.log('WantList: ', swap.wantlist);
            console.log('BlocksReceived: ', swap.blocksReceived.toNumber());
            console.log('Data Received: ', swap.dataReceived.toNumber())
            console.log('Data Sent: ', swap.dataSent.toNumber())
            console.log('Block Sent: ', swap.blocksSent.toNumber(), '\n')
        }, 30 * 1000)
    }

    ipfsApi.interval = interval
    return ipfsApi
}

