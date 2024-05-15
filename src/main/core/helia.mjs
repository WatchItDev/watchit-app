import logplease from "logplease";
import { tcp } from "@libp2p/tcp";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import { createHelia, libp2pDefaults } from "helia";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { unixfs } from "@helia/unixfs";

const log = logplease.create("HELIA");

function getConfig(env = "node") {
  const defaults = libp2pDefaults();
  return {
    start: true,
    libp2p: Object.assign({}, defaults, {
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws", "/webrtc"],
      },
      // streamMuxers: [yamux()],
      transports: [
        tcp(),
        webSockets({ websocket: { rejectUnauthorized: false } }),
        circuitRelayTransport({ discoverRelays: 3 }),
        // webRTC(), solo para web
        // webTransport(), solo para web
        webRTCDirect(),
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
export async function Helia() {
  const config = getConfig();
  const node = await createHelia(config);
  const fs = unixfs(node);
  log.info(`Running helia with peer ${node.libp2p.peerId}`);


   // uncomment for print peer connecting info
   node.libp2p.addEventListener("peer:connect", (ev) => {
    console.log("[peer:connect]", ev.detail);
  });

  return {
    node,
    fs,
  };
}
