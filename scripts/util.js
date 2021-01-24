const os = require('os');
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


const execPassthru = async (execCmd, exec_ = null) => {
    console.log('Running', execCmd);
    exec_ = exec_ || await getElevatedExec();
    return new Promise((resolve, reject) => {
        exec_(execCmd, (error, stdout, stderr) => {
            if (error) return console.error(`error: ${error.message}`) && reject();
            if (stderr) console.log(`stderr: ${stderr}`);
            console.log(`stdout: ${stdout}`);
            resolve()
        })
    })
}

module.exports.execPassthru = execPassthru;
module.exports.getElevateExec = getElevatedExec;
module.exports.isWin = isWin
module.exports.isLinux = isLinux
module.exports.osType = osType