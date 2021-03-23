const log = require('electron-log')
const isBrowser = typeof process === 'undefined'
log.warn(`Key ${isBrowser ? 'Browser' : 'Node'} env`)

module.exports = require(
    // Handle multiple envs for browser or node package
    isBrowser && './browser' || './node'
)

