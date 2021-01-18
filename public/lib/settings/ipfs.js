module.exports = () => {
    return {
        "Addresses": {
            "API": "/ip4/0.0.0.0/tcp/5002",
            "Gateway": "/ip4/0.0.0.0/tcp/9090",
            "Announce": [
                '/ip4/0.0.0.0/tcp/4003',
                '/ip4/0.0.0.0/tcp/4004/ws'
            ],
            "Swarm": [
                "/ip4/0.0.0.0/tcp/4002",
                "/ip4/127.0.0.1/tcp/4003/ws"
            ],
            "Delegates": [
                "/dns4/node0.delegate.ipfs.io/tcp/443/https",
                "/dns4/node1.delegate.ipfs.io/tcp/443/https",
                "/dns4/node2.delegate.ipfs.io/tcp/443/https",
                "/dns4/node3.delegate.ipfs.io/tcp/443/https"
            ]
        }
    }
}