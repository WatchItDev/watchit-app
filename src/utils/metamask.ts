import { MetaMaskSDK } from '@metamask/sdk';
import { Address } from 'viem';

/**
 * Connects to MetaMask and retrieves the wallet address.
 * @returns A promise resolving to the connected wallet address.
 */
export const connectToMetaMask = async (): Promise<Address> => {
  const MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: 'watchit',
      url: window.location.href,
    },
    openDeeplink: (url) => {
      // redirect to the MetaMask mobile app link
      const isMM = (window as any).ethereum?.isMetaMask;
      if (typeof (window as any).ethereum === 'undefined' || !isMM) {
        // Mobile / no extension
        window.location.href = 'https://metamask.app.link';
      } else {
        // Desktop with MetaMask extension
        window.location.href = url;
      }
    },
  });

  await MMSDK.init();
  const accounts = await MMSDK.connect();
  return accounts[0] as Address;
};
