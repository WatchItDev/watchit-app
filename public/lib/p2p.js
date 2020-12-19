'use strict'

const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const wrtc = require('wrtc')
const Websockets = require('libp2p-websockets')
const WebrtcStar = require('libp2p-webrtc-star')
const Bootstrap = require('libp2p-bootstrap')
const Gossipsub = require('libp2p-gossipsub')
const MulticastDNS = require('libp2p-mdns')
const KadDHT = require('libp2p-kad-dht')
const MPLEX = require('libp2p-mplex')
const {NOISE} = require('libp2p-noise')
const {FaultTolerance} = require('libp2p/src/transport-manager');
const Settings = require('./settings/ipfs')

const AL_LIST = [
    '/ip4/0.0.0.0/tcp/4003',
    '/ip4/0.0.0.0/tcp/4004/ws'
]

module.exports = (opts) => {
    const peerId = opts.peerId;
    const bootstrapList = opts.config.Bootstrap
    
    // Build and return our libp2p node
    return new Libp2p({
        peerId,
        addresses: {
            announce: AL_LIST,
            listen: [
                ...AL_LIST,
                ...Settings.SWARM_LISTEN
            ]
        },
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
                [MulticastDNS.tag]: {
                    interval: 1000,
                    enabled: true
                },
                [WebrtcStar.tag]: {
                    enabled: true
                },
                bootstrap: {
                    enabled: true,
                    list: [
                        ...Settings.BOOTSTRAP_LIST, 
                        ...bootstrapList
                    ]
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
                }
            }
        }
    })
}
