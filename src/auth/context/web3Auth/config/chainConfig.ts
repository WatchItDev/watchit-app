// import { CustomChainConfig } from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";
// import { polygonAmoy } from "wagmi/chains";

export const chain = {
  // polygonAmoy: {
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   chainId: "0x" + polygonAmoy.id.toString(16),
  //   rpcTarget: polygonAmoy.rpcUrls.default.http[0],
  //   displayName: polygonAmoy.name,
  //   tickerName: polygonAmoy.nativeCurrency?.name,
  //   ticker: polygonAmoy.nativeCurrency?.symbol,
  //   blockExplorerUrl: polygonAmoy.blockExplorers?.default.url[0] as string,
  // },
  polygonAmoy: {
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
};
