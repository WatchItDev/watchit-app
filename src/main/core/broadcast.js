// const EventEmitter = require('events')
const PubSub = require('orbit-db-pubsub')

module.exports = class Broadcast extends PubSub {
    constructor(ipfs, peerId) {
        super(ipfs, peerId);
        this.peerId = peerId; // IPFS node id
    }

    static getInstance(ipfs, peerId) {
        return new Broadcast(ipfs, peerId)
    }
}