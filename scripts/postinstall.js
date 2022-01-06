const {execPassthru} = require('./util')
;(async () => {
    /***
     * Run post install fixes and install peer deps
     */

    await execPassthru('npm i wrtc@0.4.7 ipfs@0.60.2 level-js@6.1.0 --no-save')
    await execPassthru('electron-builder install-app-deps')
    await execPassthru('npm rebuild ursa-optional')
})()

