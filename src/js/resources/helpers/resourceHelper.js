import utilHelper from "./utilHelper";
import settings from 'js/settings'

export default {

    async torrent(resource) {
        const resCheck = await window.Streamer.getHealth(resource.index)
        resource['health'] = utilHelper.calcHealth(resCheck)
        return resource
    },

    async hls(resource) {
        // Fill schema definition with `health` prop
        resource['health'] = 1
        return resource
    },

    _switch(resource, type) {
        /***
         * Return switched resource type
         * @type {{torrent: default.torrent, hls: default.hls}}
         * @return <object>: {...object, {health:int}}
         */

        const types = {
            'hls': this.hls,
            'torrent': this.torrent
        }

        if (type in types && settings.allowedResource.includes(type))
            return types[type](resource)
    },
    async * match(resources) {
        for (const resource of resources) {
            yield await this._switch(resource, resource.type)
        }
    }

}