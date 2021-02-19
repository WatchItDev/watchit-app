import utilHelper from "./utilHelper";

export default {

    torrent(resource) {
        return Promise.all(resource.map((t, i) => this.streamer.getHealth(t.hash, i))).then((v) => {
            v.forEach((h) => resource[h.index]['health'] = utilHelper.calcHealth(h));
            this.setState({movies: r});
        })
    },
    hls() {

    },

    switchResource(resources, type) {

    }

}