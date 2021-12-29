import settings from '@settings'

// TODO write tests
export default {
  getVideoProtocol (videoResourceObject) {
    if (!('index' in videoResourceObject)) throw new Error('Invalid resource scheme')
    const videoIndex = videoResourceObject.index // Get index based on scheme
    return 'dash' in videoIndex ? 'dash' : 'hls'
  },
  parseMovie (videoResource) {
    const videoProtocol = this.getVideoProtocol(videoResource)
    const dashInput = videoResource.index?.dash
    const hlsInput = videoResource.index?.hls
    const videoSource = Object.is(videoProtocol, 'dash') ? dashInput : hlsInput
    return this.dummyParse(`${videoResource.route}/${videoSource}`)
  },

  parsePosterUri (resource, index) {
    const imageRoute = resource?.image?.route
    const imageIndex = resource?.image?.index[index]
    return this.dummyParse(`${imageRoute}${imageIndex}`)
  },
  dummyParse (resource) {
    const random = Math.floor(Math.random() * settings.gateways.length)
    return `${settings.gateways[random]}/ipfs/${resource}`
  }
}
