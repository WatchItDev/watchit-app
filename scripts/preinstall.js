const log = require('logplease').create('PREINSTALL')
const { execPassthru, getElevateExec, osType } = require('./util')

const executePreInstall = async () => {
  log.info('Installing on', osType)
  try {
    // Try `npm cache clean --force` if packages isn't installed
    await execPassthru('npm install go-ipfs@0.11.0 --no-save', await getElevateExec())
  } catch (err) {
    log.error(err)
  }
}

executePreInstall()
