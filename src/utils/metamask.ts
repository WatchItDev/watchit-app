import { MetaMaskSDK } from '@metamask/sdk';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { Address } from 'viem';

/**
 * Connects to MetaMask and retrieves the wallet address.
 * @returns A promise resolving to the connected wallet address.
 */
export const connectToMetaMask = async (): Promise<Address> => {
  const MMSDK = new MetaMaskSDK({
    infuraAPIKey: GLOBAL_CONSTANTS.INFURA_API_KEY,
    dappMetadata: {
      name: 'WatchitApp',
      url: window.location.href,
    },
    openDeeplink: (url) => {
      // @ts-ignore
      const isMM = window.ethereum?.isMetaMask;

      if (typeof window.ethereum === 'undefined' || !isMM) {
        window.location.href = 'https://metamask.app.link';
      } else {
        window.location.href = url;
      }
    },
  });

  await MMSDK.init();
  const accounts = await MMSDK.connect();
  return accounts[0] as Address;
};
