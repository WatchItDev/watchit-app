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
                            {urls: 'stun.l.google.com:19302'},
                            {
                                url: 'turn:numb.viagenie.ca',
                                credential: 'muazkh',
                                username: 'webrtc@live.com'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=udp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=tcp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            },
                            {
                                url: 'turn:turn.bistri.com:80',
                                credential: 'homeo',
                                username: 'homeo'
                            },
                            {
                                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
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