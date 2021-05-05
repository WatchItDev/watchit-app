const EventEmitter = require('events')
const WebTorrent = require('webtorrent')
const log = require('logplease').create('TORRENT')

module.exports = class BrowserStreamer extends EventEmitter {


    _client(opts) {
        log.info('Running WebTorrent')
        return new WebTorrent({
            ...opts, ...{
                tracker: {
                    rtcConfig: {
                        iceServers: [
                            {urls: 'stun:23.21.150.121'},
                            {urls: 'stun:relay.backups.cz'},
                            {
                                urls: 'turn:relay.backups.cz',
                                credential: 'webrtc',
                                username: 'webrtc'
                            },
                            {
                                urls: 'turn:relay.backups.cz?transport=tcp',
                                credential: 'webrtc',
                                username: 'webrtc'
                            }
                        ]
                    }
                }
            }
        });
    }

    runServer() {
        // abstract method
    }

    onReady() {
        this.started = true;
        this.emit('ready', null, null, this);
        this.flix.file.renderTo(this.flix.videoRef, {
            autoplay: true
        }, () => this.emit('start', {}))
    }

}