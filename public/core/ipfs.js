const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const Ctl = require('ipfsd-ctl')
const settings = require('./settings')
const ipfsConf = require('./settings/ipfs');
const {removeFiles} = require('./utils');

const inDev = Object.is(process.env.ENV, 'dev')
const resolveIpfsPaths = () => {
    /***
     * Check for relative path for go-ipfs in prod env
     * @type {string}
     */
    if (inDev) return require('go-ipfs').path()
    const runtimeDir = path.dirname(path.resolve(__dirname, '..'))
    const rootUnpacked = path.join(`${runtimeDir}.unpacked`, 'node_modules', 'go-ipfs')
    const paths = [
        path.join(rootUnpacked, 'go-ipfs', 'ipfs'),
        path.join(rootUnpacked, 'go-ipfs', 'ipfs.exe'),
    ]

    for (const bin of paths) {
        if (fs.existsSync(bin)) {
            return bin
        }
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

    // If api file exists on node setup ipfs-daemon.js line:183 doest spawn process
    // Be sure this lock 'api' file doesnt exists before node boot..
    const apiLockFile = path.join(settings.ROOT_IPFS_DIR, 'api')
    if (fs.existsSync(apiLockFile)) {
        log.warn('Removing old `api` file');
        removeFiles(apiLockFile)
    }

    // Check if running time dir exists
    log.warn('Starting node');
    ipc.reply('orbit-progress', 'Booting')
    await isInstance.init()
    await isInstance.start();

    const ipfsApi = isInstance.api
    const id = await ipfsApi.id()
    log.info('Running ipfs id', id.id)
    return ipfsApi
}

