const EventEmitter = require('events')

class WebIPC extends EventEmitter {
    send(event, ...rest) {
        this.emit(event, this, ...rest)
    }

    reply(event, ...rest) {
        this.send(event, ...rest)
    }

}

const webIPC = new WebIPC();
webIPC.on('party', () => {
    localStorage.removeItem('key')
    webIPC.emit('party-success')
})

webIPC.on('store-flush', (self, db) => {
    console.error('flushing db')
    db.remove({}, {multi: true}, (err, numRemoved) => {
        // Remove data from local db
        console.log(err);
        console.log(numRemoved);
    });
})

module.exports = webIPC
/// zdpuAqmb6oqfa7XCCfaohMCq3arQqJhMn5ffzKhp4t65BGHQx