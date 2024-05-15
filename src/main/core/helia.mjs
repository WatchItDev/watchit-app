import { tcp } from "@libp2p/tcp";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import { createHelia, libp2pDefaults } from "helia";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { yamux } from "@chainsafe/libp2p-yamux";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { unixfs } from "@helia/unixfs";

function getConfig(env = "node") {
  const defaults = libp2pDefaults();
  return {
    start: true,
    libp2p: Object.assign({}, defaults, {
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws", "/webrtc"],
      },
      streamMuxers: [yamux()],
      transports: [
        webSockets({ websocket: { rejectUnauthorized: false } }),
        circuitRelayTransport({ discoverRelays: 3 }),
        tcp(),
        webRTC(),
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
    })
  };
}

// Tricky implementation to allow handle helia in electron and browser
// Helia is an ESM-only module but Electron currently only supports CJS
// at the top level, so we have to use dynamic imports to load it
export async function Helia() {
  const config = getConfig();
  const node = await createHelia(config);
  const fs = unixfs(node);

  return {
    node,
    fs,
  };
}
