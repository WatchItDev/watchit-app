import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AccountAbstractionProvider, KernelSmartAccount } from '@web3auth/account-abstraction-provider';
import { WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { chain } from "./chainConfig.ts";
import { CreateConnectorFn } from 'wagmi';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { polygonAmoy } from "wagmi/chains";

export const chain = {
  polygonAmoy: {
    isTestnet: true
    rpcTarget: polygonAmoy.rpcUrls.default,
    blockExplorerUrl: polygonAmoy.blockExplorers.default.url,
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x13882",
    displayName: name,
    ticker: symbol,
    tickerName: symbolName,
    logo: "https://web3auth.io/images/web3authlog.png",
  },
};

const modalConfig = {
  [WALLET_ADAPTERS.AUTH]: {
    label: "openlogin",
    loginMethods: {
      discord: {
        // it will hide the facebook option from the Web3Auth modal.
        name: "discord login",
        showOnModal: true,
      },
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


export function web3AuthConnectorFactory(): [Web3Auth, CreateConnectorFn] {
  // account abstraction setup
  const accountAbstractionProvider = new AccountAbstractionProvider({
    config: {
      chainConfig: chain.polygonAmoy,
      smartAccountInit: new KernelSmartAccount(),
      bundlerConfig: { url: process.env.VITE_PIMLICO as string },
      paymasterConfig: { url: process.env.VITE_PIMLICO as string },
    }
  });

  // ethereum prover for web3 auth
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chain.polygonAmoy },
  });

  const web3AuthOptions: Web3AuthOptions = {
    privateKeyProvider,
    accountAbstractionProvider,
    chainConfig: chain.polygonAmoy,
    clientId: GLOBAL_CONSTANTS.WEB3_CLIENT_ID,
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
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    // This will allow you to use EthereumPrivateKeyProvider for
    // external wallets, while use the AccountAbstractionProvider
    // for Web3Auth embedded wallets.
    useAAWithExternalWallet: false,
  };

  const web3AuthInstance = new Web3Auth(web3AuthOptions);
  return [web3AuthInstance, Web3AuthConnector({ web3AuthInstance, modalConfig })];
}
