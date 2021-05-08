const TorrentStream = require('./index')

class TorrentStreamMiddleware {

    constructor(broker) {
        this.broker = broker;
        this.torrent = new TorrentStream();
    }


    intercept(message) {
        //What we do when message incoming?
    }

}