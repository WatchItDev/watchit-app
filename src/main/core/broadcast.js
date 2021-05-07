const EventEmitter = require('events')
const PubSub = require('orbit-db-pubsub')

module.exports = class Broadcast extends PubSub {

    constructor(...props) {
        super(...props);
        // Extending EventEmitter
        this.__proto__ = Object.assign(
            this.__proto__, EventEmitter.prototype
        )
    }


    static getInstance(...props) {
        return new Broadcast(...props)
    }
}