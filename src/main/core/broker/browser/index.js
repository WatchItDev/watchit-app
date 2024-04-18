/* global localStorage */
const EventEmitter = require('events')

class WebIPC extends EventEmitter {
  send (event, ...rest) {
    this.emit(event, this, ...rest)
  }

  reply (event, ...rest) {
    this.send(event, ...rest)
  }
}

const webIPC = new WebIPC()
webIPC.on('party', () => {
  localStorage.removeItem('key')
  webIPC.emit('party-success')
})

module.exports = webIPC
