const log = require('electron-log')
const {execPassthru, getElevateExec,  osType} = require('./util');

const executePreInstall = async () => {
    log.info('Installing ipfs in', osType);
    try {
        await execPassthru('npm install go-ipfs@0.7.0 --no-save', await getElevateExec());
    } catch (err) {
        log.error(err);
    }
}

executePreInstall();