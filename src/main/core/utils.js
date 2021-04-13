const log = require('./logs');
const rimraf = require('rimraf');

module.exports.removeFiles = (dirOrFIle, options) => {
    return new Promise((resolve) => {
        rimraf(dirOrFIle, {
            ...{
                disableGlob: true,
                maxBusyTries: 20,
                emfileWait: 10 * 1000
            }, ...options
        }, () => {
            log.warn('Delete file ' + dirOrFIle);
            resolve()
        });
    })
}