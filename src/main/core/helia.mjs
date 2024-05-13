import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

import { tcp } from "@libp2p/tcp";
import { all } from "@libp2p/websockets/filters";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webTransport } from "@libp2p/webtransport";
import { webSockets } from "@libp2p/websockets";

// import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { bootstrap } from "@libp2p/bootstrap";
import { mdns } from "@libp2p/mdns";
// Tricky implementation to allow handle helia in electron and browser
// Helia is an ESM-only module but Electron currently only supports CJS
// at the top level, so we have to use dynamic imports to load it

export async function Helia() {
  const node = await createHelia({
    start: true,
    libp2p: {
      addresses: {
        listen: [
          "/ip4/0.0.0.0/tcp/0",
          "/ip6/::/tcp/0",
          "/webrtc",
          "/wss",
          "/ws",
        ],
      },
      services: {
        pubsub: gossipsub({
          allowPublishToZeroPeers: true,
          emitSelf: true,
          canRelayMessage: true,
        }),
      },
      peerDiscovery: [
        mdns(),
        bootstrap({
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
          ],
        }),
        // pubsubPeerDiscovery(),
      ],
      transports: [
        tcp(),
        webSockets({ websocket: { rejectUnauthorized: false } }),
        webRTC(),
        webRTCDirect(),
        // webTransport(),
        // https://github.com/libp2p/js-libp2p-websockets#libp2p-usage-example
        circuitRelayTransport({ discoverRelays: 3 }),
      ],
    },
  });

  const fs = unixfs(node);
  node.libp2p.getMultiaddrs().forEach((addr) => {
    console.log("Listening:", addr.toString());
  });

  setInterval(async () => {
    console.log("Connected peers count:", node.libp2p.getPeers().length);
  }, 5000);

  return {
    node,
    fs,
  };
}
