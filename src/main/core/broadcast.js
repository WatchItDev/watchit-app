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
        } catch {
            return false
        }
    }

    broadcast(message) {
        // Broadcast message to all subscriptions topics
        Object.keys(this._subscriptions).forEach((topic) => {
            log.info('Sending message to:', topic)
            this.publish(topic, message)
        })
    }

    _execMiddleware(message) {
        // Propagate message to middleware
        if (message.to in this._middlewares)
            this._middlewares[message.to].intercept(
                message // Depends on message the middleware can take and action
            )
    }

    async _handleMessage(message) {
        log.info('Incoming message from broadcast')
        const parsedData = this._fromUint8Array(message.data);
        if (parsedData?.to) return this._execMiddleware(parsedData)
        super._handleMessage(message)
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