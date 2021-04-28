const fs = require('fs')
const path = require('path')
const Ctl = require('ipfsd-ctl')
const defaultConf = require('./settings');
const log = require('logplease').create('IPFS')

// Path settings and util helper lib
const {removeFiles} = require('../../utils');
const {ROOT_IPFS_DIR} = require('../../settings')

const RETRY_GRACE = 5
const resolveIpfsPaths = () => require('go-ipfs').path()
    .replace('app.asar', 'app.asar.unpacked')


const forceKill = async (isInstance) => {
    log.info('Forcing stop')
    return await isInstance.stop();
}, initIpfsNode = async (isInstance) => {
    // Check if running time dir exists
    log.warn('Starting node');
    try {
        // try initialize node
        await isInstance.init();
    } catch (e) {
        log.error('Fail initializing node')
    }

    return isInstance.start();
}, startRunning = async () => {
    const isInstance = await Ctl.createController({
        ipfsOptions: {config: defaultConf(), repo: ROOT_IPFS_DIR},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: resolveIpfsPaths(), forceKill: true,
        disposable: false, forceKillTimeout: 1000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

    //If locked node try to release lock using API
    const repoLockDir = `${ROOT_IPFS_DIR}/repo.lock`
    const alreadyLock = fs.existsSync(repoLockDir)
    if (alreadyLock) {
        log.warn('Releasing locked node')
        await removeFiles(repoLockDir)
        await forceKill(isInstance)
    }

    //If api file exists on node setup ipfs-daemon.js line:183 doest spawn process
    //Be sure this lock 'api' file doesnt exists before node boot..
    const apiLockFile = path.join(ROOT_IPFS_DIR, 'api')
    if (fs.existsSync(apiLockFile)) {
        log.warn('Removing old `api` file');
        await removeFiles(apiLockFile)
    }

    try {
        await initIpfsNode(isInstance)
        setTimeout(async () => {
            if (!isInstance.started) {
                log.info('Forcing start..')
                await forceKill(isInstance) // Force init
                await initIpfsNode(isInstance)
            }
        }, RETRY_GRACE * 1000)
    } catch (e) {
        // Avoid throw default error
        log.error('Fail on start cleanup node')
        await IsInstance.cleanup();
        return false;
    }

    const ipfsApi = isInstance?.api
    const id = ipfsApi.peerId
    log.info(`Started ${isInstance.started}`)
    log.info('Running ipfs id', id?.id)

    return ipfsApi
}


module.exports = {
    start: startRunning
}

