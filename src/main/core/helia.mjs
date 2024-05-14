import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

// import { tcp } from "@libp2p/tcp";
// // import { all } from "@libp2p/websockets/filters";
// import { webRTC, webRTCDirect } from "@libp2p/webrtc";
// // import { webTransport } from "@libp2p/webtransport";
// import {
//   circuitRelayTransport,
//   circuitRelayServer,
// } from "@libp2p/circuit-relay-v2";
// import { webSockets } from "@libp2p/websockets";
// import { kadDHT } from "@libp2p/kad-dht";
// import { uPnPNAT } from "@libp2p/upnp-nat";
// import { autoNAT } from "@libp2p/autonat";
// import { identify } from "@libp2p/identify";
// import { ipnsSelector } from "ipns/selector";
// import { ipnsValidator } from "ipns/validator";
// // import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
// import { gossipsub } from "@chainsafe/libp2p-gossipsub";
// Tricky implementation to allow handle helia in electron and browser
// Helia is an ESM-only module but Electron currently only supports CJS
// at the top level, so we have to use dynamic imports to load it

export async function Helia() {
  const node = await createHelia({
    start: true,
    // libp2p: {
    //   addresses: {
    //     listen: [
    //       "/ip4/0.0.0.0/tcp/0",
    //       "/ip6/::/tcp/0",
    //       "/webrtc",
    //       "/wss",
    //       "/ws",
    //     ],
    //   },
    //   services: {
    //     pubsub: gossipsub({
    //       allowPublishToZeroPeers: true,
    //       emitSelf: true,
    //       canRelayMessage: true,
    //     }),
    //     identify: identify(),
    //     upnp: uPnPNAT(),
    //     autoNAT: autoNAT(),
    //     pubsub: gossipsub({
    //       allowPublishToZeroPeers: true,
    //       emitSelf: true,
    //       canRelayMessage: true,
    //     }),
    //     dht: kadDHT({
    //       validators: { ipns: ipnsValidator },
    //       selectors: { ipns: ipnsSelector },
    //     }),
    //     relay: circuitRelayServer({ advertise: true }),
    //   },
    //   transports: [
    //     tcp(),
    //     webSockets({ websocket: { rejectUnauthorized: false } }),
    //     webRTC(),
    //     webRTCDirect(),
    //     // webTransport(),
    //     // https://github.com/libp2p/js-libp2p-websockets#libp2p-usage-example
    //     circuitRelayTransport({ discoverRelays: 3 }),
    //   ],
    // },
  });

  const fs = unixfs(node);
  setInterval(async () => {
    console.log("Connected peers count:", node.libp2p.getPeers().length);
  }, 5000);

  return {
    node,
    fs,
  };
}
