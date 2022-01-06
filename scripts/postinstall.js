const log = require('logplease').create('PREINSTALL')
const { execPassthru, getElevateExec, osType } = require('./util')

;(async () => {
  log.info('Installing on', osType)
  try {
    // Try `npm cache clean --force` if packages isn't installed
    await execPassthru('npm install go-ipfs@0.10.0 --no-save', await getElevateExec())
    await execPassthru('npm install wrtc@0.4.7 ipfs@0.60.2 level-js@6.1.0 --no-save', await getElevateExec())
    await execPassthru('npm install blockstore-core@1.0.2 blockstore-datastore-adapter@2.0.2 --no-save', await getElevateExec())
  } catch (err) {
    log.error(err)
  }
})()

