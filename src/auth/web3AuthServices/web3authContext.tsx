import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";

import { chain } from "../config/chainConfig";
import { AccountAbstractionProvider, KernelSmartAccount } from '@web3auth/account-abstraction-provider';

const clientId = "BEUBURZkLpvEJVRr8IE1uHXFJSb_lgBIO3fBGaBQfDoM9aW-RXe1BKLx_Bx2KvyysuH-bNtynmkg0yYN-K4e_ZM";

const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig: chain.polygon,
    smartAccountInit: new KernelSmartAccount(),
    bundlerConfig: {
      // Get the pimlico API Key from dashboard.pimlico.io
      url: `https://rpc.zerodev.app/api/v2/bundler/f40ea2da-5fff-4e17-a570-8eb467564fdf`,
    },
    paymasterConfig: {
      // Get the pimlico API Key from dashboard.pimlico.io
      url: `https://rpc.zerodev.app/api/v2/paymaster/f40ea2da-5fff-4e17-a570-8eb467564fdf?selfFunded=true\\`,
    },
  }
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chain.polygon,
  },
});

export const web3AuthOptions: Web3AuthOptions = {
  chainConfig: chain.polygon,
  clientId,
  privateKeyProvider,
  accountAbstractionProvider,
  web3AuthNetwork: 'sapphire_devnet',
  // This will allow you to use EthereumPrivateKeyProvider for
  // external wallets, while use the AccountAbstractionProvider
  // for Web3Auth embedded wallets.
  useAAWithExternalWallet: false,
};
