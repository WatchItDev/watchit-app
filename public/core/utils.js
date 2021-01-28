const log = require('electron-log');
const rimraf = require('rimraf');

module.exports.removeFiles = (dirOrFIle, options) => {
    rimraf(dirOrFIle, {
        ...{
            disableGlob: true,
            maxBusyTries: 20,
            emfileWait: 10 * 1000
        }, ...options
    }, () => {
        log.warn('Delete file ' + dirOrFIle);
    });
}