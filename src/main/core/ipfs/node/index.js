const fs = require('fs')
const path = require('path')
const getPort = require('get-port')
const Ctl = require('ipfsd-ctl')
const defaultConf = require('./settings')
const log = require('logplease').create('IPFS')
const IPFSClient = require('ipfs-http-client')

// Path settings and util helper lib
const { removeFiles } = require('../../utils')
const { ROOT_IPFS_DIR } = require('../../settings')

const DEFAULT_LOOPBACK = '127.0.0.1'
const RETRY_GRACE = 20 * 1000
const DEFAULT_API_PORT = 5001
const DEFAULT_GATEWAY_PORT = 8080
const KILL_TIMEOUT = 15 * 1000
const DEFAULT_SWARM_TCP = 4010
const DEFAULT_SWARM_WS = 4011
const resolveIpfsPaths = () => require('go-ipfs').path()
  .replace('app.asar', 'app.asar.unpacked')

const forceKill = async (isInstance) => {
  log.info('Forcing stop')
  await isInstance.stop()
  log.warn('Cleaning bad repo')
  await removeFiles(ROOT_IPFS_DIR)
}

const initIpfsNode = async (isInstance) => {
  // Check if running time dir exists
  log.warn('Starting node')
  try {
    // try initialize node
    await isInstance.init()
  } catch (e) {
    log.error('Fail initializing node')
  }

  return isInstance.start()
}

const ipfsFactory = async (conf = {}) => {
  // Link to current local node
  if ('node' in conf) {
    log.info('Using provided node on port:', conf.node)
    return IPFSClient.create({
      host: DEFAULT_LOOPBACK,
      port: conf.node,
      protocol: 'http'
    })
  }

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
  const isInstance = await Ctl.createController({
    ipfsOptions: {
      ...{
        config: defaultConf({ api, gateway, swarmTCP, swarmWS }),
        repo: ROOT_IPFS_DIR
      },
      ...conf
    },
    ipfsHttpModule: IPFSClient,
    ipfsBin: resolveIpfsPaths(),
    disposable: false,
    args: ['--enable-pubsub-experiment'],
    forceKill: true,
    remote: false,
    forceKillTimeout: KILL_TIMEOUT,
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
      if (!isInstance.started) {
        log.info('Forcing start')
        await isInstance.stop() // Force init
        await initIpfsNode(isInstance)
      }
    }, RETRY_GRACE)
    await initIpfsNode(isInstance)
  } catch (e) {
    // Avoid throw default error
    log.error('Fail on start')
    return false
  }
  await forceKill(isInstance)

  const ipfsApi = isInstance?.api
  const id = ipfsApi.peerId
  log.info(`Started ${isInstance.started}`)
  log.info('Running ipfs id', id.id)
  ipfsApi.kill = async () => isInstance.stop()

  return ipfsApi
}

module.exports = {
  start: ipfsFactory
}
