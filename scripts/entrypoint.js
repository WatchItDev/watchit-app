const os = require('os');
const osType = os.type().toLowerCase()
const isWin = osType === 'windows_nt' || osType === 'win32'
const isLinux = osType === 'linux'
const {execPassthru} = require('./util')

if (isWin) execPassthru('npm i windows-elevate', require('child_process').exec)
const {exec} = require(isWin ? 'windows-elevate' : 'child_process')

if (isLinux) {
    // Fix The SUID sandbox helper binary was found
    // execPassthru('sudo chown root.root node_modules/electron/dist/chrome-sandbox -R', exec)
    execPassthru('sudo chmod 4755 -R node_modules/electron/dist/chrome-sandbox', exec)
}

execPassthru('cd node_modules/unzip/node_modules/fstream/ && npm i graceful-fs@4.2.4 --save', exec)
execPassthru('npm install go-ipfs@0.6.0', exec)
execPassthru('electron-builder install-app-deps', exec)
execPassthru('npm rebuild ursa-optional', exec)


