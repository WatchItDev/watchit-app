const log = require('logplease').create('PREINSTALL')
const {execPassthru, getElevateExec, osType} = require('./util');

const executePreInstall = async () => {
    log.info('Installing on', osType);
    try {
        // Try `npm cache clean --force` if packages isn't installed
        await execPassthru('npm install go-ipfs@0.6.0 --no-save', await getElevateExec());
        await execPassthru('npm install ipfs@0.52.1 --no-save', await getElevateExec());
        await execPassthru('npm install level-js@6.0.0 --no-save', await getElevateExec());
        await execPassthru('npm install webtorrent@0.116.1 --no-save', await getElevateExec());
        await execPassthru('bash -c "source scripts/node-prune.sh"', await getElevateExec());
    } catch (err) {
        log.error(err);
    }
}

executePreInstall();
