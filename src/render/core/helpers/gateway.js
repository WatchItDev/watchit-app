import settings from '@settings'


export default {
    getVideoProtocol(videoResourceObject) {
        if (!('index' in videoResourceObject)) throw new Error('Invalid resource scheme')
        const videoIndex = videoResourceObject.index; // Get index based on scheme
        return 'dash' in videoIndex ? 'dash' : 'hls'

    },
    parseMovie(videoResource) {
        const videoProtocol = this.getVideoProtocol(videoResource)
        const dashInput = `${videoResource.index?.dash}/index.mpd`
        const hlsInput = `${videoResource.index?.hls}/index.m3u8`
        const videoSource = Object.is(videoProtocol, 'dash') ? dashInput : hlsInput
        return this.dummyParse(`${videoResource.route}/${videoSource}`)
    },

    dummyParse(resource) {
        const random = Math.floor(Math.random() * settings.gateways.length)
        return `${settings.gateways[random]}/ipfs/${resource}`
    }
}
