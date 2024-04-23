const log = require('logplease').create('PEER-INSTALL')
const { execPassthru, getElevateExec, osType } = require('./util')

;(async () => {
  log.info('Installing on', osType)
  try {
    // Try `npm cache clean --force` if packages isn't installed
    await execPassthru('npm install level-js@6.1.0 --no-save', await getElevateExec())
  } catch (err) {
    log.error(err)
  }
})()

