module.exports = () => {
  return {
    Bootstrap: [
      '/dns4/watchitapp.site/tcp/443/wss/p2p/12D3KooWGuS8AVUokZ7MKCvNTXn6mv5wYLAP86Rg5snDz7SbZgSZ',
      '/dns4/direct.vps1.phillm.net/tcp/443/wss/p2p/QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g',
      '/dns4/direct.vps2.phillm.net/tcp/443/wss/p2p/12D3KooWCcy4kVFxv6PpvzybLW5cytmwYCEHQSQpsWXoAX2QPkt4',
      '/dns4/direct.vps3.phillm.net/tcp/443/wss/p2p/12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw'
    ],
    Addresses: {
      Delegates: [
        '/dns4/node0.delegate.ipfs.io/tcp/443/https',
        '/dns4/node1.delegate.ipfs.io/tcp/443/https',
        '/dns4/node2.delegate.ipfs.io/tcp/443/https',
        '/dns4/node3.delegate.ipfs.io/tcp/443/https'
      ],
      Swarm: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
      ]
    }
  }
}
