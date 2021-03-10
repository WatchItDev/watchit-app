const {execPassthru, isLinux} = require('./util')


const executePostInstall = async () => {
    /***
     * Run post install fixes and install peer deps
     */
    if (isLinux) {
        // Fix The SUID sandbox helper binary was found
        // execPassthru('sudo chown root.root node_modules/electron/dist/chrome-sandbox -R', exec)
        await execPassthru('sudo chmod 4755 -R node_modules/electron/dist/chrome-sandbox')
    }


    await execPassthru('cd node_modules/unzip/node_modules/fstream/ && npm i graceful-fs@4.2.4 --no-save')
    await execPassthru('electron-builder install-app-deps')
    await execPassthru('npm rebuild ursa-optional')
}

executePostInstall();




