import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";

import { chain } from "./chainConfig.ts";
import { AccountAbstractionProvider, KernelSmartAccount } from '@web3auth/account-abstraction-provider';
import { WALLET_ADAPTERS } from '@web3auth/base';

export const clientId = "BEUBURZkLpvEJVRr8IE1uHXFJSb_lgBIO3fBGaBQfDoM9aW-RXe1BKLx_Bx2KvyysuH-bNtynmkg0yYN-K4e_ZM";

const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig: chain.polygonAmoy,
    smartAccountInit: new KernelSmartAccount(),
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

export const modalConfig = {
  [WALLET_ADAPTERS.AUTH]: {
    label: "openlogin",
    loginMethods: {
      email_passwordless: {
        name: "email_passwordless",
        showOnModal: false,
      },
      sms_passwordless: {
        name: "sms_passwordless",
        showOnModal: false,
      },
      facebook: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "facebook login",
        showOnModal: false,
      },
      reddit: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "reddit login",
        showOnModal: false,
      },
      discord: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "discord login",
        showOnModal: false,
      },
      twitch: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "twitch login",
        showOnModal: false,
      },
      apple: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "apple login",
        showOnModal: false,
      },
      line: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "line login",
        showOnModal: false,
      },
      github: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "github login",
        showOnModal: false,
      },
      kakao: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "kakao login",
        showOnModal: false,
      },
      linkedin: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "linkedin login",
        showOnModal: false,
      },
      twitter: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "twitter login",
        showOnModal: false,
      },
      wechat: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "wechat login",
        showOnModal: false,
      },
      weibo: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "weibo login",
        showOnModal: false,
      },
      farcaster: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "farcaster login",
        showOnModal: false,
      }
    },
    // setting it to false will hide all social login methods from modal.
    showOnModal: true,
  },
}
