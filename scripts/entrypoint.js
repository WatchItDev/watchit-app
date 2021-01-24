const os = require('os');
const osType = os.type().toLowerCase()
const isWin = osType === 'windows_nt' || osType === 'win32'
const isLinux = osType === 'linux'
const {execPassthru} = require('./util')
const {exec} = require('child_process')

const getElevatedExec = async () => {
    if (isWin) {
        await execPassthru('npm i windows-elevate --no-save', exec)
        const winExec = require('windows-elevate').exec
        return (execCmd, callback) => {
            winExec('cmd', ['/S', '/C', execCmd], callback)
        }
    }
    return exec
}

const executePostInstall = async () => {
    if (isLinux) {
        // Fix The SUID sandbox helper binary was found
        // execPassthru('sudo chown root.root node_modules/electron/dist/chrome-sandbox -R', exec)
        await execPassthru('sudo chmod 4755 -R node_modules/electron/dist/chrome-sandbox', exec)
    }

    // Installing fallback OS
    console.log('Installing ipfs in', osType)
    try {
        await execPassthru('npm install go-ipfs@0.6.0 --no-save', await getElevatedExec())
    } catch (err) {
        console.error(err)
    }

    await execPassthru('cd node_modules/unzip/node_modules/fstream/ && npm i graceful-fs@4.2.4 --save', exec)
    await execPassthru('npm install go-ipfs@0.6.0', exec)
    await execPassthru('electron-builder install-app-deps', exec)
    await execPassthru('npm rebuild ursa-optional', exec)
}

executePostInstall();




