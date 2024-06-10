import logplease from "logplease";
import { createHelia, libp2pDefaults } from "helia";
import { unixfs } from "@helia/unixfs";

import { tcp } from "@libp2p/tcp";
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from "@libp2p/websockets";
import { webTransport } from '@libp2p/webtransport'
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'

const log = logplease.create("HELIA");
const PUBSUB_PEER_DISCOVERY = 'watchit-pubsub-discovery';

function getConfig(runtime = "node") {
  const isBrowserRuntime = runtime === "web";
  const defaults = libp2pDefaults();

  // Here we handle the logic the setup the corresponding conf for each runtime.
  // eg. Since browser cannot dial via tcp, we remote and same for node don't use web-transport, etc  
  const listen = [
    // node listen
    ...((!isBrowserRuntime && [
      "/ip4/0.0.0.0/tcp/0",
      "/ip4/0.0.0.0/tcp/0/ws",
      "/webrtc",
    ]) || [
        "/webrtc", "/ws",
      ]),
  ];

  const peerDiscovery = [
    ...defaults.peerDiscovery,
    ...(isBrowserRuntime && [
      pubsubPeerDiscovery({
        interval: 10_000,
        topics: [PUBSUB_PEER_DISCOVERY],
        listenOnly: false,
      })
    ] || [])
  ]

  const transports = [
    ...((!isBrowserRuntime && [
      tcp(),
      circuitRelayTransport({ discoverRelays: 3 }),
      webSockets({ websocket: { rejectUnauthorized: false } }),
    ]) || [
        // https://github.com/libp2p/js-libp2p/issues/1896
        webTransport(),
        webSockets(),
        circuitRelayTransport({ discoverRelays: 1 }),
        webRTC()
      ]),
    webRTCDirect(), // both runtimes
  ];

  return {
    start: true,
    libp2p: Object.assign({}, defaults, {
      transports,
      addresses: { listen },
      peerDiscovery,
      streamMuxers: [
        yamux()
      ],
      services: {
        ...defaults.services,
        pubsub: gossipsub({
          allowPublishToZeroPeers: true,
          emitSelf: true,
          canRelayMessage: true,
        }),
      },
    }),
  };
}


// Tricky implementation to allow handle helia in electron and browser
// Helia is an ESM-only module but Electron currently only supports CJS
// at the top level, so we have to use dynamic imports to load it
export async function Helia(runtime) {
  const config = getConfig(runtime);
  const node = await createHelia(config);
  const fs = unixfs(node);
  log.info(`Running helia with peer ${node.libp2p.peerId}`);

  return {
    node,
    fs,
  };
}
