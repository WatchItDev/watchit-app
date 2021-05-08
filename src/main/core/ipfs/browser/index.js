const IPFS = require('ipfs');
const log = require('logplease').create('IPFS')
const defaultConf = require('./settings');


const ipfsFactory = async (conf = {}) => {

    // Ipfs factory
    const isInstance = await IPFS.create({
        ...{
            config: defaultConf(), preload: {enabled: false},
            EXPERIMENTAL: {pubsub: true, ipnsPubsub: true, dht: true},
            libp2p: {config: {dht: {enabled: true}}},
        }, ...conf
    })

    try {
        await isInstance.start();
        const ipfsID = await isInstance.id()
        isInstance.kill = async () => isInstance.stop(); // Alias to stop
        isInstance.peerId = ipfsID; // Add virtual attr needed for broadcasting
        log.info('Running ipfs id', ipfsID.id)
        return isInstance
    } catch (e) {
        await isInstance.stop().catch(() => log.error('Error trying to stop node'));
        log.error('Fail on start: cleanup node')
        return false;
    }

}

module.exports = {
    start: ipfsFactory
}