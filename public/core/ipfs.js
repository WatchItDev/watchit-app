const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const Ctl = require('ipfsd-ctl')
const settings = require('./settings')
const ipfsConf = require('./settings/ipfs');
const {removeFiles} = require('./utils');

const RETRY_GRACE = 5
const resolveIpfsPaths = () => require('go-ipfs').path()
    .replace('app.asar', 'app.asar.unpacked')

const initIpfsNode = async (isInstance, ipc) => {
    try {
        // Check if running time dir exists
        log.warn('Starting node');
        ipc.reply('orbit-progress', 'Booting')

        await isInstance.init();
        await isInstance.start();
    } catch (e) {
        // Gateway stop
        log.info(e.message)
        if (isInstance.subprocess)
            return await isInstance.stop();
        await isInstance.api.stop();
    }

}

module.exports = async (ipc) => {

    const isInstance = await Ctl.createController({
        ipfsOptions: {config: ipfsConf(), repo: settings.ROOT_IPFS_DIR},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: resolveIpfsPaths(),
        disposable: false, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    //If api file exists on node setup ipfs-daemon.js line:183 doest spawn process
    //Be sure this lock 'api' file doesnt exists before node boot..
    const apiLockFile = path.join(settings.ROOT_IPFS_DIR, 'api')
    if (fs.existsSync(apiLockFile)) {
        log.warn('Removing old `api` file');
        await removeFiles(apiLockFile)
    }

    setTimeout(async () => {
        if (!isInstance.started) {
            await isInstance.stop() // Force init
            await initIpfsNode(isInstance, ipc)
        }
    }, RETRY_GRACE * 1000)

    await initIpfsNode(isInstance, ipc)
    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    log.info(`Started ${isInstance.started}`)
    log.info('Running ipfs id', id.id)
    return ipfsApi
}

