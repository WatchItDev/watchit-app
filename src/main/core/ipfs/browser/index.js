const fs = require('fs')
const log = require('electron-log')
const IPFS = require('ipfs');
const settings = require('./settings')
const ipfsConf = require('./settings/ipfs');

export default async (repo) => {
    const CONF = Object.assign({libp2p}, {repo}, ipfsConf);
    const isInstance = await IPFS.create(CONF)
    log.info(`Started ${isInstance.started}`)
    log.info('Running ipfs id', isInstance.id())
    return isInstance
}
