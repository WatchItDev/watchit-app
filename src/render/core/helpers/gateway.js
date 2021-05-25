import settings from 'settings'

export default {

  _builtPath (resource) {
    let builtPath = resource.cid
    builtPath = 'quality' in resource && !resource.abs ? `${builtPath}/${resource.quality}` : builtPath
    builtPath = 'index' in resource ? `${builtPath}/${resource.index}` : builtPath
    return builtPath
  },

  dummyParse (resource) {
    if (!('cid' in resource)) throw new Error('Resource object need at least `cid`')
    const builtPath = this._builtPath(resource) // Build path using index and optional quality
    const random = Math.floor(Math.random() * settings.gateways.length)
    return `${settings.gateways[random]}/ipfs/${builtPath}`
  }
}
