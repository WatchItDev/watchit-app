const log = require('electron-log')
log.transports.file.level = false;
log.transports.console.level = true;
module.exports = log

