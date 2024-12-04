import { CHAIN_NAMESPACES } from "@web3auth/base";
import { defineChain } from 'viem';

const name = 'Polygon Amoy'
const symbol = 'POL'
const symbolName = 'Polygon'
const rpc = `${process.env.VITE_RPC_ALCHEMY}`

export const chain = {
  polygonAmoy: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13882",
    rpcTarget: rpc,
    displayName: name,
    blockExplorerUrl: "https://www.oklink.com/amoy",
    ticker: symbol,
    tickerName: symbolName,
    logo: "https://web3auth.io/images/web3authlog.png",
    isTestnet: true
  },
};

export const wagmi = {
  polygonAmoy: defineChain({
    id: 80_002,
    name: name,
    nativeCurrency: { name: symbolName, symbol: symbol, decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpc],
      },
    },
    blockExplorers: {
      default: {
        name: 'Ok',
        url: 'https://www.oklink.com/amoy',
        apiUrl: 'https://www.oklink.com/amoy',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 3127388,
      },
    },
    testnet: true,
  })
}
