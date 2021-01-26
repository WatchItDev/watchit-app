const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const Ctl = require('ipfsd-ctl')
const ipfsConf = require('./settings/ipfs');

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
        ipfsOptions: {config: ipfsConf()},
        ipfsHttpModule: require('ipfs-http-client'),
        ipfsBin: resolveIpfsPaths(),
        disposable: false, forceKillTimeout: 2000,
        args: ['--enable-pubsub-experiment'],
        remote: false, type: 'go'
    })

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

