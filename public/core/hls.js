const hls = require('hls.js')
const log = require('electron-log')
const conf = require('./settings/hls')

module.exports = class HLSStreamer {

    play(uri, {videoRef, onReady}) {
        if (hls.isSupported()) {
            log.warn(`Starting hls: ${uri}`)
            const hlsStreamer = new hls(conf)
            hlsStreamer.attachMedia(videoRef)
            uri = 'https://gateway.anime4all.net/ipfs/QmRLPbxAadtEWLtRVnP92Zh29f34kewEfEJrqx7z5WdnFb/index.m3u8'

            // When media attached then try to play streaming!!
            hlsStreamer.on(hls.Events.MEDIA_ATTACHED, () => {
                log.info('Media ready for video')
                hlsStreamer.loadSource(uri);
                hlsStreamer.on(hls.Events.MANIFEST_PARSED, () => {
                    log.info('m3u8 manifest loaded')
                    videoRef.play();
                    onReady(uri);
                })
            })

            // Handling errors
            hlsStreamer.on(hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.log(data.type);
                    switch (data.type) {
                        case hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            console.log('fatal network error encountered, try to recover');
                            hls.startLoad();
                            break;
                        case hls.ErrorTypes.MEDIA_ERROR:te
                            console.log('fatal media error encountered, try to recover');
                            hls.recoverMediaError();
                            break;
                        default:
                            // cannot recover
                            hls.destroy();
                            break;
                    }
                }
            })

        } else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
            onReady(uri)
        }
    }

    stop() {
        //Dummy stop
    }

}