const Ctl = require('ipfsd-ctl')
const ipfsConf = require('./settings/ipfs');
let interval = null;


module.exports = async () => {
    const isInstance = await Ctl.createController({
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: require('go-ipfs').path(),
        ipfsOptions: {config: ipfsConf()},
        disposable: true, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    console.log('Running ipfs id', id.id)
    return ipfsApi
}

