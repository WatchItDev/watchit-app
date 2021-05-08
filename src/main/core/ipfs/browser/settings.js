module.exports = () => {
    return {
        "Discovery": {"MDNS": {"Enabled": true, "Interval": 10}},
        "Bootstrap": [
            "/dns4/watchitapp.site/tcp/4002/wss/p2p/QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg",
            "/dns4/direct.vps1.phillm.net/tcp/4002/wss/p2p/QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g",
            "/dns4/direct.vps2.phillm.net/tcp/4002/wss/p2p/12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF",
            "/dns4/direct.vps3.phillm.net/tcp/4002/wss/p2p/12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw",
        ],
        "Addresses": {
            "Swarm": [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
            ]
        }
    }
}