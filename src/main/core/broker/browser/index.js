const EventEmitter = require('events')

class WebBroker extends EventEmitter {
    send() {
    }
}

module.exports = new WebBroker();