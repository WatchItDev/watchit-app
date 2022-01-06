const {execPassthru} = require('./util')
;(async () => {
    await execPassthru('electron-builder install-app-deps')
    await execPassthru('npm rebuild ursa-optional')
})()

