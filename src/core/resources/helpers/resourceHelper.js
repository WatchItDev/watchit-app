import utilHelper from "./utilHelper";
import settings from 'src/core/settings'

export default {

    torrentStreamer: window.Torrent,
    hlsStreamer: window.HLS,

    async torrent(resource) {
        const streamer = window.Torrent;
        resource['health'] = 0;
        if ('index' in resource) {
            const resCheck = await streamer.getHealth(resource.index)
            resource['health'] = utilHelper.calcHealth(resCheck)
        }
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
    * match(resources) {
        for (const resource of resources) {
            yield this._switch(resource, resource.type)
        }
    }

}