const log = require('logplease').create('TORRENT_MIDDLEWARE')
const TorrentStream = require('./index')
const SEED_SIGNAL = 'middleware-torrent-seed'
const ALLOWED_SIGNALS = [SEED_SIGNAL]

module.exports = class TorrentStreamMiddleware {

    constructor(broker, channel) {
        this.broker = broker;
        this.channel = channel;
        this.streamer = null;
        this.actives = {};
        this.addSignalListeners();
    }

    addSignalListeners() {
        ALLOWED_SIGNALS.forEach((e) => {
            this.broker.on(e, this.signalCall)
        })
    }

    _runTorrentSeed(payload) {
        this.streamer = TorrentStream.getInstance()
        this.streamer.play(payload)
        this.actives[SEED_SIGNAL] = true;
    }

    uiIntercept(message, raw) {
        // Avoid seeding broadcast overflow
        if (message.signal in this.actives) return;
        const uiMessage = `Peer ${raw.from} requesting seed movie`
        log.info('Waiting for request approval')
        log.info(uiMessage)
        // Emit message to UI
        this.channel.reply(message.signal, uiMessage)
    }

    signalCall(e, signal) {
        const signals = {
            SEED_SIGNAL: this._runTorrentSeed
        }

        if (signal in signals)
            return signals[signal]
        return false;
    }

    intercept(e, message, rawMessage) {
        //What we do when incoming message?
        if (ALLOWED_SIGNALS.includes(message?.signal)) {
            this.uiIntercept(message, rawMessage)
        }
    }

    static getInstance(...props) {
        return new TorrentStreamMiddleware(...props)
    }

}