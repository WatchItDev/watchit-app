const log = require('electron-log')
const {execPassthru, getElevateExec,  osType} = require('./util');

const executePreInstall = async () => {
    log.info('Installing ipfs in', osType);
    try {
        await execPassthru('npm install go-ipfs@0.6.0 --no-save', await getElevateExec());
        await execPassthru('curl -sf https://gobinaries.com/tj/node-prune | bash', await getElevateExec());
    } catch (err) {
        log.error(err);
    }
}

executePreInstall();
