import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";

import { chain } from "../config/chainConfig";
import { AccountAbstractionProvider, SafeSmartAccount } from '@web3auth/account-abstraction-provider';

export const clientId = "BEUBURZkLpvEJVRr8IE1uHXFJSb_lgBIO3fBGaBQfDoM9aW-RXe1BKLx_Bx2KvyysuH-bNtynmkg0yYN-K4e_ZM";

const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig: chain.polygonAmoy,
    smartAccountInit: new SafeSmartAccount(),
    bundlerConfig: {
      // Get the pimlico API Key from dashboard.pimlico.io
      url: `https://api.pimlico.io/v2/80002/rpc?apikey=pim_NjucSQWxtjQHuXBXAQiUAX`,
    },
    paymasterConfig: {
      // Get the pimlico API Key from dashboard.pimlico.io
      url: `https://api.pimlico.io/v2/80002/rpc?apikey=pim_NjucSQWxtjQHuXBXAQiUAX`,
    },
  }
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chain.polygonAmoy,
  },
});

export const web3AuthOptions: Web3AuthOptions = {
  chainConfig: chain.polygonAmoy,
  clientId,
  privateKeyProvider,
  accountAbstractionProvider,
  uiConfig: {
    appName: 'Watchit',
    loginMethodsOrder: ["google"],
    defaultLanguage: "en",
    modalZIndex: "2147483647",
    logoLight: "https://pbs.twimg.com/profile_images/1814015504412987392/7FKUViWb_400x400.jpg",
    logoDark: "https://pbs.twimg.com/profile_images/1814015504412987392/7FKUViWb_400x400.jpg",
    uxMode: "popup",
    mode: "dark",
  },
  web3AuthNetwork: 'sapphire_devnet',
  // This will allow you to use EthereumPrivateKeyProvider for
  // external wallets, while use the AccountAbstractionProvider
  // for Web3Auth embedded wallets.
  useAAWithExternalWallet: false,
};
