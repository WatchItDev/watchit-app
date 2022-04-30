const fs = require('fs')
const path = require('path')
const getPort = require('get-port')
const Ctl = require('ipfsd-ctl')
const defaultConf = require('./settings')
const log = require('logplease').create('IPFS')

// Path settings and util helper lib
const { removeFiles } = require('../../utils')
const { ROOT_IPFS_DIR } = require('../../settings')

const RETRY_GRACE = 20 * 1000
const KILL_TIMEOUT = 15 * 1000
const DEFAULT_API_PORT = 6002
const DEFAULT_GATEWAY_PORT = 9090
const DEFAULT_SWARM_TCP = 4010
const DEFAULT_SWARM_WS = 4011
const resolveIpfsPaths = () => require('go-ipfs').path()
  .replace('app.asar', 'app.asar.unpacked')

/**
 * Enforce IPFS node shutdown
 * 
 * @param ipfs - IPFS controller
 */
const forceKill = async (ipfs) => {
  log.info('Forcing stop')
  await ipfs.stop()
  log.warn('Cleaning bad repo')
  await removeFiles(ROOT_IPFS_DIR)
};

/**
 * Init/Start ipfs node
 * 
 * @param ipfs - Ipfs controller 
 * @returns {Promise} Promise resolved by ipfs controller
 */
const initIpfsNode = async (ipfs) => {
  // Check if running time dir exists
  log.warn('Starting node')
  try {
    // try initialize node
    await ipfs.init()
  } catch (e) {
    log.error('Fail initializing node')
  }

  return ipfs.start()
};

/**
 * Create IPFS controller and init node
 * 
 * @param {*} conf 
 * @returns {} IPFS interface
 */
const ipfsFactory = async (conf = {}) => {
  // Find available ports to avoid conflict
  const [api, gateway, swarmTCP, swarmWS] = await Promise.all([
    getPort({ port: DEFAULT_API_PORT }),
    getPort({ port: DEFAULT_GATEWAY_PORT }),
    getPort({ port: DEFAULT_SWARM_TCP }),
    getPort({ port: DEFAULT_SWARM_WS })
  ])

  log.info('Running API on port:', api)
  log.info('Running Gateway on port:', gateway)
  log.info('Swarm TCP listening on port:', swarmTCP)
  log.info('Swarm WS listening on port:', swarmWS)

  // Init factory spawn daemon
  const ipfs = await Ctl.createController({
    ipfsOptions: {
      ...{
        config: defaultConf({ api, gateway, swarmTCP, swarmWS }),
        repo: ROOT_IPFS_DIR
      },
      ...conf
    },
    ipfsHttpModule: require('ipfs-http-client'),
    ipfsBin: resolveIpfsPaths(),
    forceKill: true,
    disposable: false,
    forceKillTimeout: KILL_TIMEOUT,
    args: ['--enable-pubsub-experiment'],
    remote: false,
    type: 'go'
  })

  // If api file exists on node setup ipfs-daemon.js line:183 doest spawn process
  // Be sure this lock 'api' file doesnt exists before node boot..
  const apiLockFile = path.join(ROOT_IPFS_DIR, 'api')
  if (fs.existsSync(apiLockFile)) {
    log.warn('Removing old `api` file')
    await removeFiles(apiLockFile)
  }

  try {
    setTimeout(async () => {
      if (!ipfs.started) {
        log.info('Forcing start')
        await ipfs.stop() // Force init
        await initIpfsNode(ipfs)
      }
    }, RETRY_GRACE)
    await initIpfsNode(ipfs)
  } catch (e) {
    // Avoid throw default error
    log.error('Fail on start')
    await forceKill(ipfs)
    return false
  }

  const ipfsApi = ipfs?.api
  const id = ipfsApi.peerId
  ipfsApi.kill = async () => ipfs.stop()
  log.info(`Started ${ipfs.started}`)
  log.info('Running ipfs id', id.id)

  return ipfsApi
}

module.exports = {
  start: ipfsFactory
}
