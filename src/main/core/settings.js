const os = require('os')
const path = require('path')
const fs = require('fs')

const ROOT_DIR = os.tmpdir()
const ROOT_HOME = os.homedir()
const ROOT_STORE = process.env.appPath
const ROOT_APP = fs.realpathSync(process.cwd())
const ROOT_TMP_FOLDER = path.join(ROOT_DIR, 'wtmp')
const ROOT_RUNNING_DB = path.join(ROOT_STORE, 'walloc')
const ROOT_DB_DIR = path.join(ROOT_RUNNING_DB, 'linvo')
const ROOT_IPFS_DIR = path.join(ROOT_HOME, '.ipfsw')

module.exports = {
  ROOT_APP,
  ROOT_DIR,
  ROOT_HOME,
  ROOT_STORE,
  ROOT_DB_DIR,
  ROOT_IPFS_DIR,
  ROOT_RUNNING_DB,
  ROOT_TMP_FOLDER
}
