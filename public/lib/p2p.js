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
const Settings = require('./settings/orbit')

const ADDRESS_LIST = [
    '/ip4/0.0.0.0/tcp/4003',
    '/ip4/0.0.0.0/tcp/4004/ws'
]

module.exports = (opts) => {
    const peerId = opts.peerId;
    // Build and return our libp2p node
    return new Libp2p({
        peerId,
        addresses: {
            announce: ADDRESS_LIST,
            listen: [
                ...ADDRESS_LIST,
                ...Settings.BOOTSTRAP_LISTEN
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
                        // Default bootstraps
                        `/ip4/${Settings.BOOTSTRAP_IP}/tcp/4001/p2p/${Settings.BOOTSTRAP_HASH}`,
                        `/ip4/${Settings.BOOTSTRAP_IP}/tcp/4002/ws/p2p/${Settings.BOOTSTRAP_HASH}`,
                        '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
                        '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
                        '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
                        '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN'
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
