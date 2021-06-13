const EventEmitter = require('events')

module.exports = class BrowserCast extends EventEmitter {
  constructor () {
    super()
    this.players = []
  }

  createServer () {
    return this
  }

  requestUpdate () {
    return this
  }

  stop () {
    // Not implemented
  }

  setPlayer (i) {
    // Not implemented
  }

  play (title, stream) {
    // Not implemented
  }
}
