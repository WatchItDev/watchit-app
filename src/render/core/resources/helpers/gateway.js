import settings from 'settings'

export default {

    _builtPath(resource) {
        let builtPath = resource.cid
        builtPath = 'quality' in resource && !resource.abs ? `${builtPath}/${resource.quality}` : builtPath
        builtPath = 'index' in resource ? `${builtPath}/${resource.index}` : builtPath
        return builtPath
    },

    dummyParse(resource) {
        const builtPath = this._builtPath(resource)
        const random = Math.floor(Math.random() * settings.gateways.length);
        return `${settings.gateways[random]}/ipfs/${builtPath}`
    }
}
