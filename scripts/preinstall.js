const {execPassthru, getElevateExec} = require('./util');

const executePreInstall = async () => {
    try {
        await execPassthru('npm install go-ipfs@0.6.0 --no-save', await getElevateExec());
    } catch (err) {
        log.error(err);
    }
}

executePreInstall();