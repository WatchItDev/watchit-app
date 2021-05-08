const log = require('logplease').create('BROADCAST')
const EventEmitter = require('events')
const PubSub = require('orbit-db-pubsub')

module.exports = class Broadcast extends PubSub {

    constructor(...props) {
        super(...props);
        const [ipfs,] = props
        this._id = ipfs.peerId.id;
        this._middlewares = {};

        log.warn('Broadcast running')
        // Extending EventEmitter
        this.__proto__ = Object.assign(
            this.__proto__, EventEmitter.prototype
        )
    }

    _fromUint8Array(message) {
        try {
            return JSON.parse(
                Buffer.from(message).toString()
            )
        } catch (e){
            console.log(e);
            return message
        }
    }

    async _handleMessage(message) {
        const parsedData = message.data
        console.log(this._fromUint8Array(parsedData));

        super._handleMessage(message)
    }

    async multicast(topic) {
        // const currentPeers = await this.getPeers(topic)

    }

    addMiddleware(middleware) {
        // Middleware class name as index
        this._middlewares[middleware.name] = middleware
    }

    getPeers(topic) {
        return this._ipfs.pubsub.peers(topic)
    }


    static getInstance(...props) {
        return new Broadcast(...props)
    }
}