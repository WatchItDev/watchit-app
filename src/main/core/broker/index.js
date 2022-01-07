const Broker = require('./broker')
const renderer = require(
  // Handle multiple envs for browser or node package
  process.env.RUNTIME === 'web' ? './browser' : './node'
)

// Construct broker with renderer
module.exports = class BrokerFactory {
  static getInstance () {
    return new Broker(
      renderer // WebIPC || Electron.MainIPC
    )
  }
}
