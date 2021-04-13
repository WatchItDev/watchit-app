import utilHelper from "./util";
import settings from 'settings'

const torrent = window.bridge.Torrent
const hls = window.bridge.HLS

export default {

    async torrent(resource) {
        resource['health'] = 0;
        if ('index' in resource) {
            const resCheck = await torrent.getHealth(resource.index)
            resource['health'] = utilHelper.calcHealth(resCheck)
        }
        return resource
    },

    async hls(resource) {
        // Fill schema definition with `health` prop
        resource['health'] = 10
        return resource
    },

    streamer(type) {
        /***
         * Return switched streamer type
         * @type {{torrent: default.torrent, hls: default.hls}}
         * @return <object>: Streamer
         */
        if (!settings.streaming.includes(type))
            return false;

        return {
            'hls': hls,
            'torrent': torrent,
        }[type]
    },
    resource(resource, type) {
        /***
         * Return switched resource type
         * @type {{torrent: default.torrent, hls: default.hls}}
         * @return <object>: {...object, {health:int}}
         */

        if (!settings.streaming.includes(type))
            return false;

        return {
            'hls': this.hls,
            'torrent': this.torrent
        }[type](resource)
    },
    * match(resources) {
        for (const resource of resources) {
            yield this.resource(
                resource, resource.type
            )
        }
    }

}