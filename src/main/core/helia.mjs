import logplease from "logplease";
import { createHelia, libp2pDefaults } from "helia";
import { unixfs } from "@helia/unixfs";

import { tcp } from "@libp2p/tcp";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { webRTCStar } from "@libp2p/webrtc-star";
import { webSockets } from "@libp2p/websockets";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import * as filters from "@libp2p/websockets/filters";

const log = logplease.create("HELIA");

function getConfig(runtime = "node") {
  const isBrowserRuntime = runtime === "web";
  const defaults = libp2pDefaults();
  const star = webRTCStar();

  // Here we handle the logic the setup the corresponding conf for each runtime.
  // eg. Since browser cannot dial via tcp, we remote and same for node don't use web-transport, etc
  const discovery = [
    ...defaults.peerDiscovery,
    ...((isBrowserRuntime && [star.discovery]) || []),
  ];
  
  const listen = [
    // node listen
    ...((!isBrowserRuntime && [
      "/ip4/0.0.0.0/tcp/0",
      "/ip4/0.0.0.0/tcp/0/ws",
      "/webrtc",
    ]) || [
      "/ip4/0.0.0.0/tcp/0",
      "/ip4/0.0.0.0/tcp/0/ws",
      "/webrtc",
      "/wss",
      "/ws",
    ]),
  ];

  const transports = [
    ...((!isBrowserRuntime && [
      tcp(),
      webSockets({ websocket: { rejectUnauthorized: false } }),
    ]) || [
      webRTC(),
      webTransport(),
      webSockets({ filter: filters.all }),
      star.transport,
    ]),
    circuitRelayTransport({ discoverRelays: 3 }),
    webRTCDirect(), // both runtimes
  ];

  return {
    start: true,
    libp2p: Object.assign({}, defaults, {
      transports,
      addresses: { listen },
      peerDiscovery: discovery,
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

  // uncomment for print peer connecting info
  // node.libp2p.addEventListener("peer:connect", (ev) => {
  //   console.log("[peer:connect]", ev.detail);
  // });

  return {
    node,
    fs,
  };
}
