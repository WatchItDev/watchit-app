const Broker = require('./broker')
const renderer = require(
    // Handle multiple envs for browser or node package
    typeof process === 'undefined' ? './browser' : './node'
)

// Construct broker with renderer
module.exports = new Broker(renderer)

