import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const chain: {
  [key: string]: CustomChainConfig;
} = {
  ethereum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    displayName: "Ethereum Mainnet",
    rpcTarget: "https://rpc.ankr.com/eth",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  sepolia: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    displayName: "Ethereum Sepolia",
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13882",
    rpcTarget: "https://rpc-amoy.polygon.technology",
    // rpcTarget: "https://polygon-amoy.g.alchemy.com/v2/Qa8X9PrNgKT6PJFYk3j3-32riKQ5nKp5",
    displayName: "Polygon Amoy Testnet",
    blockExplorerUrl: "https://www.oklink.com/amoy",
    ticker: "POL",
    tickerName: "Polygon",
    logo: "https://web3auth.io/images/web3authlog.png",
    isTestnet: true
  },
  polygonTest: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13882", // hex of 80002, polygon testnet
    rpcTarget: "https://rpc.ankr.com/polygon_amoy",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Amoy Testnet",
    blockExplorerUrl: "https://amoy.polygonscan.com",
    ticker: "MATIC",
    tickerName: "Matic",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  base: {
    // https://docs.base.org/using-base/
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14A34", // hex of 84532
    rpcTarget: "https://sepolia.base.org",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Base Sepolia",
    blockExplorerUrl: "https://sepolia-explorer.base.org/",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  bnb: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38", // hex of 56
    rpcTarget: "https://rpc.ankr.com/bsc",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Binance SmartChain Mainnet",
    blockExplorerUrl: "https://bscscan.com/",
    ticker: "BNB",
    tickerName: "BNB",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  avalanche: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA86A", // hex of 43114
    rpcTarget: "https://rpc.ankr.com/avalanche-c",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Avalanche C-Chain Mainnet",
    blockExplorerUrl: "https://subnets.avax.network/c-chain",
    ticker: "AVAX",
    tickerName: "AVAX",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  arbitrum: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA4B1", // hex of 42161
    rpcTarget: "https://rpc.ankr.com/arbitrum",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Arbitrum Mainnet",
    blockExplorerUrl: "https://arbiscan.io",
    ticker: "AETH",
    tickerName: "AETH",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  optimism: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xA", // hex of 10
    rpcTarget: "https://rpc.ankr.com/optimism",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Optimism Mainnet",
    blockExplorerUrl: "https://optimistic.etherscan.io",
    ticker: "OP",
    tickerName: "OP",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  cronos: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x19", // hex of 25, cronos mainnet
    rpcTarget: "https://rpc.cronos.org",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Cronos Mainnet",
    blockExplorerUrl: "https://cronoscan.com/",
    ticker: "CRO",
    tickerName: "CRO",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  harmony: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x63564c40", // hex of 1666600000, Harmony mainnet
    rpcTarget: "https://rpc.ankr.com/harmony",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Harmony Mainnet",
    blockExplorerUrl: "https://explorer.harmony.one",
    ticker: "ONE",
    tickerName: "ONE",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  celo: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa4ec", // hex of 42220, Celo mainnet
    rpcTarget: "https://rpc.ankr.com/celo",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Celo Mainnet",
    blockExplorerUrl: "https://explorer.celo.org",
    ticker: "CELO",
    tickerName: "CELO",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  moonbeam: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x504", // hex of 1284, moonbeam mainnet
    rpcTarget: "https://rpc.ankr.com/moonbeam",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Moonbeam Mainnet",
    blockExplorerUrl: "https://moonbeam.moonscan.io",
    ticker: "GLMR",
    tickerName: "GLMR",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  moonriver: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x505", // hex of 1285, moonriver mainnet
    rpcTarget: "https://rpc.api.moonriver.moonbeam.network",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Moonriver Mainnet",
    blockExplorerUrl: "https://moonriver.moonscan.io",
    ticker: "MOVR",
    tickerName: "MOVR",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  klaytn: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x2019", // hex of 8217, Klaytn mainnet
    rpcTarget: "https://public-node-api.klaytnapi.com/v1/cypress",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Klaytn Mainnet",
    blockExplorerUrl: "https://scope.klaytn.com",
    ticker: "KLAY",
    tickerName: "KLAY",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  flare: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xE", // hex of 14
    rpcTarget: "https://flare-api.flare.network/ext/C/rpc",
    // Avoid using public rpcTarget in production.
    // Use services provided by Flare or other node providers
    displayName: "Flare Mainnet",
    blockExplorerUrl: "https://flare-explorer.flare.network/",
    ticker: "FLR",
    tickerName: "FLR",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  songbird: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13", // hex of 19
    rpcTarget: "https://songbird-api.flare.network/ext/C/rpc",
    // Avoid using public rpcTarget in production.
    // Use services provided by Flare or other node providers
    displayName: "Songbird canary network",
    blockExplorerUrl: "https://songbird-explorer.flare.network",
    ticker: "SGB",
    tickerName: "SGB",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  zkatana: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x133E40", // hex of 1261120
    rpcTarget: "https://rpc.zkatana.gelato.digital",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "zKatana Testnet",
    blockExplorerUrl: "https://zkatana.blockscout.com",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  // SKALE: {
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   chainId: "0x79f99296",
  //   rpcTarget: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
  //   // Avoid using public rpcTarget in production.
  //   // Use services like Infura, Quicknode etc
  //   displayName: "SKALE Europa Hub Mainnet",
  //   blockExplorerUrl: "https://elated-tan-skat.explorer.mainnet.skalenodes.com/",
  //   ticker: "sFUEL",
  //   tickerName: "sFUEL",
  // },
};
