import { createWalletClient, custom } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { MetaMaskSDK } from '@metamask/sdk';
import { GLOBAL_CONSTANTS } from '@src/config-global';

export async function ConnectWalletClient() {
  // 1) Create the MetaMaskSDK instance
  const MMSDK = new MetaMaskSDK({
    infuraAPIKey: GLOBAL_CONSTANTS.INFURA_API_KEY,
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

  // 2) Initialize the SDK if needed
  await MMSDK.init();

  // 3) Get the provider from the SDK
  const provider = MMSDK.getProvider();
  if (!provider) {
    throw new Error('Could not retrieve the MetaMask SDK provider');
  }

  // 4) Create a transport for viem using the provider
  const transport = custom(provider);

  // 5) Return a walletClient from viem that uses that provider
  return createWalletClient({
    chain: polygonAmoy,
    transport,
  });
}
