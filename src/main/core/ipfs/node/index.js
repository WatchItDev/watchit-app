const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const Ctl = require('ipfsd-ctl')
const defaultConf = require('../settings');

// Path settings and util helper lib
const {removeFiles} = require('../../utils');
const {ROOT_IPFS_DIR} = require('../../settings')

const RETRY_GRACE = 10
const resolveIpfsPaths = () => require('go-ipfs').path()
    .replace('app.asar', 'app.asar.unpacked')


const forceKill = async (isInstance) => {
    log.info('Forcing stop')
    return await isInstance.stop();
}, initIpfsNode = async (isInstance) => {
    try {
        // Check if running time dir exists
        log.warn('Starting node');
        await isInstance.init();
        await isInstance.start();
    } catch (e) {
        // Gateway stop
        await forceKill(isInstance)
    }

}, startRunning = async () => {

    const isInstance = await Ctl.createController({
        ipfsOptions: {config: defaultConf(), repo: ROOT_IPFS_DIR},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: resolveIpfsPaths(),
        disposable: false, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    //If locked node try to release lock using API
    const repoLockDir = `${ROOT_IPFS_DIR}/repo.lock`
    const alreadyLock = fs.existsSync(repoLockDir)
    if (alreadyLock) {
        log.warn('Releasing locked node')
        await removeFiles(repoLockDir)
        return await forceKill(isInstance)
    }

    //If api file exists on node setup ipfs-daemon.js line:183 doest spawn process
    //Be sure this lock 'api' file doesnt exists before node boot..
    const apiLockFile = path.join(ROOT_IPFS_DIR, 'api')
    if (fs.existsSync(apiLockFile)) {
        log.warn('Removing old `api` file');
        await removeFiles(apiLockFile)
    }

    setTimeout(async () => {
        if (!isInstance.started) {
            await forceKill(isInstance) // Force init
            await initIpfsNode(isInstance)
        }
    }, RETRY_GRACE * 1000)

    await initIpfsNode(isInstance)
    const ipfsApi = isInstance?.api

    const id = await ipfsApi.id()
    log.info(`Started ${isInstance.started}`)
    log.info('Running ipfs id', id?.id)

    return ipfsApi
}


module.exports = {
    start: startRunning
}

