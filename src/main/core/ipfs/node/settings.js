module.exports = (ports) => {

    return {
        "Gateway": {
            "NoFetch": false,
            "PathPrefixes": [],
            "RootRedirect": "",
            "Writable": false,
            "HTTPHeaders": {
                "Access-Control-Allow-Credentials": ["true"],
                "Access-Control-Allow-Origin": ["*"],
                "Access-Control-Expose-Headers": ["Location"],
                "Access-Control-Allow-Methods": ["GET"],
                "Access-Control-Allow-Headers": [
                    "X-Requested-With",
                    "Range",
                    "User-Agent"
                ]
            }
        },
        "Bootstrap": [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
            "/ip4/104.131.131.82/udp/4001/quic/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
            "/ip4/209.222.98.165/tcp/4001/p2p/12D3KooWAH9FypmaduofuBTtubSHVJghxW35aykce23vDHjfhiAd"
        ],
        "Addresses": {
            "API": `/ip4/127.0.0.1/tcp/${ports.api}`, // default 6002
            "Gateway": `/ip4/127.0.0.1/tcp/${ports.gateway}`, // default 9090
            "Announce": [],
            "NoAnnounce": [],
            "Swarm": [
                `/ip4/0.0.0.0/tcp/${ports.swarmTCP}`, // default 4010
                `/ip4/0.0.0.0/tcp/${ports.swarmWS}/ws`, //default 4011
                "/ip6/::/tcp/4003",
                "/ip6/::/udp/4003/quic"
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
                {"ID": "QmSHSTNyKJ1EGVVKj7dKZFmxj9FaBfE7S23MNTj1Jwungg", "Addrs": ["/ip4/34.214.114.130/tcp/4001"]},
                {"ID": "QmVzpedLC9oeUPsZZmVFZLZo12sMk6CfXpG2ykUj3xdwTa", "Addrs": ["/ip4/34.210.174.172/tcp/4001"]},
                {"ID": "QmbPFTECrXd7o2HS2jWAJ2CyAckv3Z5SFy8gnEHKxxH52g", "Addrs": ["/ip4/144.172.69.157/tcp/4001"]},
                {
                    "ID": "12D3KooWQw3vx2E4FKpL9GHC9BpFya1MXVUFEVBAQVhMDkreCqwF",
                    "Addrs": ["/ip4/185.215.224.79/tcp/4001"]
                },
                {
                    "ID": "12D3KooWD4Z47R1pnzTxCVQAiTKTHasWU2xTAcffyC38BNKM68yw",
                    "Addrs": ["/ip4/185.215.227.40/tcp/4001"]
                }
            ]
        }
    }
}