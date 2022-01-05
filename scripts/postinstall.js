const log = require('logplease').create('POSTNSTALL')
const { execPassthru, isLinux } = require('./util')

const executePostInstall = async () => {
  /***
     * Run post install fixes and install peer deps
     */
  if (isLinux) {
    // Fix The SUID sandbox helper binary was found
    log.info('Running PostInstall Script ... ')
    await execPassthru('sudo chown root.root node_modules/electron/dist/chrome-sandbox -R')
    await execPassthru('sudo chmod 4755 -R node_modules/electron/dist/chrome-sandbox')
  }

  await execPassthru('npm i wrtc@0.4.7 ipfs@0.60.2 level-js@6.1.0  --no-save')
  await execPassthru('electron-builder install-app-deps')
  await execPassthru('npm rebuild ursa-optional')
}

executePostInstall()
