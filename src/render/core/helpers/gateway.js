import settings from '@settings'

// TODO write tests
export default {
  getVideoProtocol (resource) {
    if (!('index' in resource?.video)) throw new Error('Invalid resource scheme')
    const videoIndex = resource.video.index // Get index based on scheme
    return 'dash' in videoIndex ? 'dash' : 'hls'
  },
  parseMovie (resource) {
    const videoProtocol = this.getVideoProtocol(resource)
    const dashInput = resource.video.index?.dash
    const hlsInput = resource.video.index?.hls
    const videoSource = Object.is(videoProtocol, 'dash') ? dashInput : hlsInput
    return this.dummyParse(`${resource.video.route}${videoSource}`)
  },

  parsePosterUri (resource, index) {
    const imageRoute = resource?.image?.route
    const imageIndex = resource?.image?.index[index]
    return this.dummyParse(`${imageRoute}${imageIndex}`)
  },
  dummyParse (resource) {
    const gateways = settings.gateways()
    const random = Math.floor(Math.random() * gateways.length)
    return `${gateways[random]}/ipfs/${resource}`
  }
}
