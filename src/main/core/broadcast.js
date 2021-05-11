const log = require('logplease').create('BROADCAST')
const PubSub = require('orbit-db-pubsub')

module.exports = class Broadcast extends PubSub {

    constructor(...props) {
        log.warn('Broadcast running')
        super(...props);
        const [ipfs,] = props
        this._id = ipfs.peerId.id;
        this._middlewares = {};
    }

    _fromUint8Array(message) {
        try {
            return JSON.parse(
                Buffer.from(message).toString()
            )
        } catch {
            return message
        }
    }

    broadcast(message) {
        // Broadcast message to all subscriptions topics
        Object.keys(this._subscriptions).forEach((topic) => {
            log.info('Sending message to:', topic)
            this.publish(topic, message)
        })
    }

    _execMiddleware(message, rawMessage) {
        // Propagate message to middleware
        if (message.intercept in this._middlewares)
            this._middlewares[message.intercept].intercept(
                this, message, rawMessage // Depends on message the middleware can take any action
            )
    }

    async _handleMessage(message) {
        if (Object.is(this._id, message.from)) return;
        log.info('Incoming message from broadcast')
        const parsedData = this._fromUint8Array(message.data);
        if (parsedData?.intercept) return this._execMiddleware(parsedData, message)
        super._handleMessage(message)
    }

    addMiddleware(middleware) {
        // Middleware class name as index
        const middlewareName = middleware.constructor.name
        log.info(middlewareName, 'middleware registered')
        this._middlewares[middlewareName] = middleware
    }

    getPeers(topic) {
        return this._ipfs.pubsub.peers(topic)
    }


    static getInstance(...props) {
        return new Broadcast(...props)
    }
}