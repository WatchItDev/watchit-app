const hls = require('hls.js')

module.exports = class HLSStreamer {

    play(uri, {videoRef, onReady}) {
        if (hls.isSupported()) {
            const hlsStreamer = new hls()
            hlsStreamer.loadSource(uri);
            hlsStreamer.attachMedia(videoRef)
        } else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
            onReady(uri)
        }
    }

    stop() {
        //Dummy stop
    }

}