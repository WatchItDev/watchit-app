const Ctl = require('ipfsd-ctl')
const ipfsConf = require('./settings/ipfs');
const {ROOT_RUNNING_TIME} = require('./settings/conf')
const fs = require('fs-extra');


module.exports = async () => {
    const isInstance = await Ctl.createController({
        ipfsOptions: {config: ipfsConf(), repo: ROOT_RUNNING_TIME},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: require('go-ipfs').path(),
        disposable: false, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    // Check if running time dir exists
    fs.ensureDirSync(ROOT_RUNNING_TIME)
    console.log('Starting node');
    await isInstance.init()
    await isInstance.start();

    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    console.log('Running ipfs id', id.id)
    ipfsApi.cleanup = isInstance.cleanup
    return ipfsApi
}

