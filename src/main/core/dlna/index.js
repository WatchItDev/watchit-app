const DLNA = require(
  // Handle multiple envs for browser or node package
  typeof process === 'undefined' ? './browser' : './node'
)

module.exports = class DLNAFactory {
  static getInstance () {
    return new DLNA()
  }
}
