const runtime = process.env.RUNTIME // web | node | electron
module.exports = require(
    // Handle multiple envs for browser or node package
    typeof process === 'undefined' && './browser' || './node'
)

