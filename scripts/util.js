const os = require('os');
const log = require('logplease').create('CHILD PROCESS')
const osType = os.type().toLowerCase()
const isWin = osType === 'windows_nt' || osType === 'win32'
const isLinux = osType === 'linux'
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


const execPassthru = async (execCmd, exec_= exec) => {
    /***
     * Run spawm commands
     * @param execCmd
     * @param exec_
     * @return <Promise>
     */
    log.info('Running', execCmd);
    return new Promise((resolve, reject) => {
        exec_(execCmd, (error, stdout, stderr) => {
            if (error) return log.error(`error: ${error.message}`) && reject();
            if (stderr) log.warn(`stderr: ${stderr}`);
            log.info(`stdout: ${stdout}`);
            resolve()
        })
    })
}

module.exports.execPassthru = execPassthru;
module.exports.getElevateExec = getElevatedExec;
module.exports.isWin = isWin
module.exports.isLinux = isLinux
module.exports.osType = osType