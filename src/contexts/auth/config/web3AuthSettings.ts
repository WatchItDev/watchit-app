import {
  CHAIN_NAMESPACES,
  ConnectorsModalConfig,
  WALLET_CONNECTORS,
  WEB3AUTH_NETWORK,
  type Web3AuthOptions,
} from '@web3auth/modal';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const modalConfig: ConnectorsModalConfig = {
  connectors: {
    [WALLET_CONNECTORS.AUTH]: {
      label: "openlogin",
      showOnModal: true,
      loginMethods: {
        google:  { name: "Google",  showOnModal: true },
        discord: { name: "Discord", showOnModal: true },
      },
    },
  },
};

export const web3AuthOptions: Web3AuthOptions = {
  clientId: 'BEUBURZkLpvEJVRr8IE1uHXFJSb_lgBIO3fBGaBQfDoM9aW-RXe1BKLx_Bx2KvyysuH-bNtynmkg0yYN-K4e_ZM',
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  modalConfig,
  accountAbstractionConfig: {
    smartAccountType: "kernel",
    chains: [
      {
        chainId: "0x13882",
        bundlerConfig:  { url: GLOBAL_CONSTANTS.PIMLICO },
        paymasterConfig:{ url: GLOBAL_CONSTANTS.PIMLICO },
      },
    ],
  },
  chains: [
    {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13882",
      rpcTarget: "https://polygon-amoy.g.alchemy.com/v2/Qa8X9PrNgKT6PJFYk3j3-32riKQ5nKp5",
      displayName: "Polygon Amoy",
      blockExplorerUrl: "https://amoy.polygonscan.com",
      logo: '',
      ticker: "MATIC",
      tickerName: "Matic",
    }
  ],
  defaultChainId: "0x13882",
  uiConfig: {
    appName: "Watchit",
    mode: "dark",
    logoLight: GLOBAL_CONSTANTS.LOGO_URL,
    logoDark:  GLOBAL_CONSTANTS.LOGO_URL,
    defaultLanguage: "en",
  },
};
