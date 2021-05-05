const wrtc = require('wrtc')
const WebTorrent = require('webtorrent-hybrid')
const EventEmitter = require('events')
const log = require('logplease').create('TORRENT')


module.exports = class TorrentStreamer extends EventEmitter {
    _client(opts) {
        log.info('Running WebTorrent-Hybrid')
        return new WebTorrent({...opts, ...{tracker: {wrtc}}});
    }

    runServer(port, fileIndex) {
        if (this.flix) {
            log.info('Starting server')
            this.flix.href = `http://127.0.0.1:${port}/${fileIndex}`;
            this.flix.createServer(() => {
                // Process request here!!
                // Isn't needed for now
            }).listen(port)
        }
    }

    onReady() {
        this.started = true;
        this.emit('ready', this.flix.href, this.mime, this);
        this.emit('start', {});
    }


}