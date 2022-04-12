const log = require('logplease').create('UTIL')
const rimraf = require('rimraf')


/**
 * Remove file or directory
 *
 * @param {*} dirOrFIle
 * @param {*} options
 * @return {Promise} 
 */
module.exports.removeFiles = (dirOrFIle, options) => {
  return new Promise((resolve) => {
    rimraf(dirOrFIle, {
      ...{
        disableGlob: true,
        maxBusyTries: 20,
        emfileWait: 10 * 1000
      },
      ...options
    }, () => {
      log.warn('Delete file ' + dirOrFIle)
      resolve()
    })
  })
}
