const wrtc = require('wrtc')
const ipns = require('ipns')
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Websockets = require('libp2p-websockets')
const WebrtcStar = require('libp2p-webrtc-star')
const Bootstrap = require('libp2p-bootstrap')
const Gossipsub = require('libp2p-gossipsub')
const MulticastDNS = require('libp2p-mdns')
const KadDHT = require('libp2p-kad-dht')
const MPLEX = require('libp2p-mplex')
const {NOISE} = require('libp2p-noise')
const {FaultTolerance} = require('libp2p/src/transport-manager');
const uint8ArrayToString = require('uint8arrays/to-string')

const ipnsUtils = {
    encodeBase32: (buf) => uint8ArrayToString(buf, 'base32upper'),
    selector: (_k, records) => ipns.validator.select(records[0], records[1]),
    validator: {
        func: (key, record, cb) => ipns.validator.validate(record, key, cb)
    }
}


module.exports = (opts) => {
    const {peerId, libp2pOptions, options} = opts
    // Build and return our libp2p node
    return new Libp2p(Object.assign({
        dialer: {
            maxParallelDials: 150, // 150 total parallel multiaddr dials
            maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
            dialTimeout: 10e3 // 10 second dial timeout per peer dial
        },
        transportManager: {
            faultTolerance: FaultTolerance.NO_FATAL
        },
        // Lets limit the connection managers peers and have it check peer health less frequently
        modules: {
            transport: [TCP, Websockets, WebrtcStar],
            streamMuxer: [MPLEX],
            connEncryption: [NOISE],
            peerDiscovery: [Bootstrap, MulticastDNS],
            dht: KadDHT,
            pubsub: Gossipsub
        },
        peerStore: {
            persistence: true
        },
        config: {
            transport: {
                WebRTCStar: {
                    wrtc
                }
            },
            peerDiscovery: {
                autoDial: true,
                websocketStar: {
                    enabled: false
                },
                webRTCStar: {
                    enabled: true
                },
                bootstrap: {
                    interval: 30e3,
                    enabled: true,
                    list: []
                }
            },
            relay: {
                enabled: true,
                hop: {
                    enabled: true,
                    active: true
                }
            },
            pubsub: {
                enabled: true,
                emitSelf: true
            },
            dht: {
                kBucketSize: 50,
                enabled: false,
                clientMode: true,
                randomWalk: {
                    enabled: false
                },
                validators: {
                    ipns: ipnsUtils.validator
                },
                selectors: {
                    ipns: ipnsUtils.selector
                }
            }
        }
    }, {...libp2pOptions}, {
        peerId,
        addresses: {
            announce: options.Addresses.Announce,
            listen: options.Addresses.Swarm
        },
    }))
}