const wrtc = require('wrtc')
const ipns = require('ipns')
const Libp2p = require('libp2p')
const Websockets = require('libp2p-websockets')
const WebrtcStar = require('libp2p-webrtc-star')
const Bootstrap = require('libp2p-bootstrap')
const Gossipsub = require('libp2p-gossipsub')
const MulticastDNS = require('libp2p-mdns')
const KadDHT = require('libp2p-kad-dht')
const MPLEX = require('libp2p-mplex')
const { FaultTolerance } = require('libp2p/src/transport-manager')
const uint8ArrayToString = require('uint8arrays/to-string')

const ipnsUtils = {
  /**
     * @param {Uint8Array} buf
     */
  encodeBase32: (buf) => uint8ArrayToString(buf, 'base32upper'),
  validator: {
    /**
         * @param {Uint8Array} key
         * @param {Uint8Array} record
         */
    func: (key, record) => ipns.validator.validate(record, key)
  },
  /**
     * @param {*} _k
     * @param {Uint8Array[]} records
     */
  selector: (_k, records) => ipns.validator.select(records[0], records[1])
}

module.exports = (opts) => {
  const { peerId, libp2pOptions } = opts

  // Build default conf for libp2p
  const confSettings = Object.assign({
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
      transport: [Websockets, WebrtcStar],
      streamMuxer: [MPLEX],
      peerDiscovery: [Bootstrap, MulticastDNS],
      dht: KadDHT,
      pubsub: Gossipsub
    },
    peerStore: { persistence: true },
    metrics: { enabled: true },
    config: {
      transport: {
        WebRTCStar: {
          wrtc
        }
      },
      peerDiscovery: {
        autoDial: true,
        websocketStar: { enabled: true },
        webRTCStar: { enabled: true },
        bootstrap: { enabled: true, interval: 1000 }
      },
      relay: {
        enabled: true,
        hop: { enabled: true, active: true },
        autoRelay: { enabled: true, maxListeners: 2 }
      },
      pubsub: {
        enabled: true,
        emitSelf: false
      },
      nat: { enabled: false },
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
  }, { ...libp2pOptions }, { peerId })

  // Build and return our libp2p node
  return new Libp2p(confSettings)
}
