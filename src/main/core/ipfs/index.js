module.exports = require(
  // Handle multiple envs for browser or node package
  process.env.RUNTIME === 'web' ? './browser' : './node'
)
