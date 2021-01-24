const Ctl = require('ipfsd-ctl')
const ipfsConf = require('./settings/ipfs');


module.exports = async () => {
    const isInstance = await Ctl.createController({
        ipfsOptions: {config: ipfsConf()},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: require('go-ipfs').path(),
        disposable: false, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    // Check if running time dir exists
    console.log('Starting node');
    await isInstance.init()
    await isInstance.start();

    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    console.log('Running ipfs id', id.id)
    return ipfsApi
}

