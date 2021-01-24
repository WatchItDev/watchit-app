module.exports.execPassthru = (execCmd, exec) => {
    console.log('Running', execCmd);
    return new Promise((resolve, reject) => {
        exec(execCmd, (error, stdout, stderr) => {
            if (error) return console.error(`error: ${error.message}`) && reject();
            if (stderr) console.log(`stderr: ${stderr}`);
            console.log(`stdout: ${stdout}`);
            resolve()
        })
    })
}