module.exports = {
    "Addresses": {
        "Announce": [
            '/ip4/0.0.0.0/tcp/4003',
            '/ip4/0.0.0.0/tcp/4004/ws'
        ],
        "Swarm": [
            '/ip4/0.0.0.0/tcp/4003',
            '/ip4/0.0.0.0/tcp/4004/ws',
            '/dns4/secure-beyond-12878.herokuapp.com/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'
        ],
        "Delegates": [
            "/dns4/node0.delegate.ipfs.io/tcp/443/https",
            "/dns4/node1.delegate.ipfs.io/tcp/443/https",
            "/dns4/node2.delegate.ipfs.io/tcp/443/https",
            "/dns4/node3.delegate.ipfs.io/tcp/443/https"
        ]
    },
    "Discovery": {
        "MDNS": {
            "Interval": 1000,
            "Enabled": true
        }
    },
    "Bootstrap": [
        '/ip4/127.0.0.1/tcp/4001/p2p/QmYye19FqWHncUTqzAHs9uQBeJmCQeVAJdekWwzihy8Su7',
        '/ip4/127.0.0.1/tcp/4002/ws/p2p/QmYye19FqWHncUTqzAHs9uQBeJmCQeVAJdekWwzihy8Su7'
    ]
}