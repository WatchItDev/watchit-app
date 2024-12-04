import { CHAIN_NAMESPACES } from "@web3auth/base";
import { defineChain } from 'viem';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const name = 'Polygon Amoy'
const symbol = 'POL'
const symbolName = 'Polygon'
const multiCall3BlockCreated = 3127388
const rpc = `${GLOBAL_CONSTANTS.RPC}`
const blockExplorerUrl = "https://www.oklink.com/amoy"
const multiCall3Contract = '0xca11bde05977b3631167028862be2a173976ca11'

console.log('rpc')
console.log(rpc)

export const chain = {
  polygonAmoy: {
    blockExplorerUrl,
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13882",
    rpcTarget: rpc,
    displayName: name,
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
        url: blockExplorerUrl,
        apiUrl: blockExplorerUrl
      }
    },
    contracts: {
      multicall3: {
        address: multiCall3Contract,
        blockCreated: multiCall3BlockCreated,
      },
    },
    testnet: true,
  })
}
