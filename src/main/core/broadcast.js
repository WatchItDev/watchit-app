const log = require('logplease').create('BROADCAST')
const EventEmitter = require('events')
const PubSub = require('orbit-db-pubsub')

module.exports = class Broadcast extends PubSub {

    constructor(...props) {
        super(...props);
        const [ipfs,] = props
        this._id = ipfs.peerId.id;
        log.warn('Broadcast running')
        // Extending EventEmitter
        this.__proto__ = Object.assign(
            this.__proto__, EventEmitter.prototype
        )
    }

    checkPeers(topic) {
        return this._ipfs.pubsub.peers(topic)
    }


    static getInstance(...props) {
        return new Broadcast(...props)
    }
}