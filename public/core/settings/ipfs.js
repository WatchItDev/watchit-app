module.exports = () => {
    return {
        "Addresses": {
            "API": "/ip4/127.0.0.1/tcp/5002",
            "Gateway": "/ip4/127.0.0.1/tcp/9090",
            "Swarm": [
                '/ip4/0.0.0.0/tcp/4003',
                '/ip4/0.0.0.0/tcp/4004/ws'
            ],
            "Delegates": [
                "/dns4/node0.delegate.ipfs.io/tcp/443/https",
                "/dns4/node1.delegate.ipfs.io/tcp/443/https",
                "/dns4/node2.delegate.ipfs.io/tcp/443/https",
                "/dns4/node3.delegate.ipfs.io/tcp/443/https"
            ]
        },
        "Swarm": {
            "ConnMgr": {
                "GracePeriod": "20s",
                "HighWater": 1500,
                "LowWater": 450,
                "Type": "basic"
            },
            "EnableAutoRelay": true,
            "EnableRelayHop": false
        },
        "Discovery": {"MDNS": {"Enabled": true, "Interval": 10}},
        "Peering": {
            "Peers": [
                { "ID": "QmQ4rndRVi4L2cnZ7aiD6RFfYqQpNdmnmgsZD6mgUu5zZX", "Addrs": ["/ip4/34.220.29.107/tcp/4001"] },
                { "ID": "QmP4wC6pRnkzbPdenAsoT199WctTjcGtuvvoGj89wYDs8u", "Addrs": ["/ip4/34.220.216.205/tcp/4001"] },
                { "ID": "12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF", "Addrs": ["/ip4/185.215.224.79/tcp/4001"] },
                { "ID": "12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw", "Addrs": ["/ip4/185.215.227.40/tcp/4001"] },
                { "ID": "QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g", "Addrs": ["/ip4/144.172.69.157/tcp/4001"] }
            ]
        }
    }
}