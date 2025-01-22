import { Web3Auth, Web3AuthOptions } from '@web3auth/modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import {
  AccountAbstractionProvider,
  KernelSmartAccount,
} from '@web3auth/account-abstraction-provider';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { polygonAmoy } from 'viem/chains';

export const chain = {
  polygonAmoy: {
    isTestnet: true,
    chainId: '0x13882',
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: polygonAmoy.name,
    rpcTarget: polygonAmoy.rpcUrls.default.http[0],
    blockExplorerUrl: polygonAmoy.blockExplorers.default.url,
    tickerName: polygonAmoy.nativeCurrency.name,
    ticker: polygonAmoy.nativeCurrency.symbol,
    logo: 'https://web3auth.io/images/web3authlog.png',
  },
};

export const modalConfig = {
  [WALLET_ADAPTERS.AUTH]: {
    label: 'openlogin',
    loginMethods: {
      discord: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'discord login',
        showOnModal: true,
      },
      twitter: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'twitter login',
        showOnModal: true,
      },
      reddit: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'reddit login',
        showOnModal: true,
      },
      email_passwordless: {
        name: 'email_passwordless',
        showOnModal: false,
      },
      sms_passwordless: {
        name: 'sms_passwordless',
        showOnModal: false,
      },
      facebook: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'facebook login',
        showOnModal: false,
      },
      twitch: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'twitch login',
        showOnModal: false,
      },
      apple: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'apple login',
        showOnModal: false,
      },
      line: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'line login',
        showOnModal: false,
      },
      github: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'github login',
        showOnModal: false,
      },
      kakao: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'kakao login',
        showOnModal: false,
      },
      linkedin: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'linkedin login',
        showOnModal: false,
      },
      wechat: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'wechat login',
        showOnModal: false,
      },
      weibo: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'weibo login',
        showOnModal: false,
      },
      farcaster: {
        // it will hide the facebook option from the Web3Auth modal.
        name: 'farcaster login',
        showOnModal: false,
      },
    },
    // setting it to false will hide all social login methods from modal.
    showOnModal: true,
  },
};

export function web3AuthFactory(): Web3Auth {
  // account abstraction setup
  const accountAbstractionProvider = new AccountAbstractionProvider({
    config: {
      chainConfig: chain.polygonAmoy,
      smartAccountInit: new KernelSmartAccount(),
      bundlerConfig: { url: GLOBAL_CONSTANTS.PIMLICO },
      paymasterConfig: { url: GLOBAL_CONSTANTS.PIMLICO },
    },
  });

  // ethereum prover for web3 auth
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chain.polygonAmoy },
  });

  const web3AuthOptions: Web3AuthOptions = {
    // sessionTime: 60 * 60 * 24 * 30, // 30 days
    sessionTime: 10, // 10 seconds
    privateKeyProvider,
    accountAbstractionProvider,
    chainConfig: chain.polygonAmoy,
    // storageKey: 'local',
    clientId: GLOBAL_CONSTANTS.WEB3_CLIENT_ID,
    uiConfig: {
      appName: 'Watchit',
      loginMethodsOrder: ['google'],
      defaultLanguage: 'en',
      modalZIndex: '2147483647',
      logoLight: 'https://pbs.twimg.com/profile_images/1814015504412987392/7FKUViWb_400x400.jpg',
      logoDark: 'https://pbs.twimg.com/profile_images/1814015504412987392/7FKUViWb_400x400.jpg',
      uxMode: 'popup',
      mode: 'dark',
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    // This will allow you to use EthereumPrivateKeyProvider for
    // external wallets, while use the AccountAbstractionProvider
    // for Web3Auth embedded wallets.
    useAAWithExternalWallet: false,
  };

  return new Web3Auth(web3AuthOptions);
}
