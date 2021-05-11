const log = require('logplease').create('TORRENT_MIDDLEWARE')
const TorrentStream = require('./index')
const SEED_SIGNAL = 'middleware-torrent-seed'

module.exports = class TorrentStreamMiddleware {

    constructor(broker, channel) {
        this.broker = broker;
        this.channel = channel;
        this.streamer = null;
        this.actives = this.onhold = {}; // Keep tracking
        this.broker.on(SEED_SIGNAL, this._runTorrentSeed)
    }

    _runTorrentSeed(e, response) {
        console.log(response);
        // this.streamer = TorrentStream.getInstance()
        // this.streamer.play(payload)
        // this.actives[SEED_SIGNAL] = true;
    }

    uiIntercept(message, raw) {
        // Avoid seeding broadcast overflow
        if (message.signal in this.actives) return;
        const uiMessage = `Peer ${raw.from} requesting seed movie`
        log.info('Waiting for request approval')
        log.info(uiMessage)
        // Emit authorization request to host
        this.onhold[message.signal] = message?.payload;
        this.channel.reply(message.signal, uiMessage)
    }

    intercept(e, message, rawMessage) {
        //What we do when incoming message?
        this.uiIntercept(message, rawMessage)
    }

    static getInstance(...props) {
        return new TorrentStreamMiddleware(...props)
    }

}