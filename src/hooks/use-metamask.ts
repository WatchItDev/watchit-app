// REACT IMPORTS
import { useCallback, useEffect } from 'react';

// VIEM IMPORTS
import { createWalletClient, custom, WalletClient } from 'viem';
import type { Address } from 'viem';
import { polygonAmoy } from 'viem/chains';

// METAMASK IMPORTS
import { useSDK } from '@metamask/sdk-react';
import { enqueueSnackbar } from 'notistack';
import { useDetectWalletEnvironment, WalletEnvironment } from '@src/hooks/use-detect-wallet-environment.ts';

/**
 * Represents the shape of the object returned by the useMetaMask hook.
 */
interface UseMetaMaskReturn {
  /**
   * Initiates the MetaMask connection flow via the MetaMask SDK.
   * Returns a list of connected accounts if successful.
   *
   * Throws an error if the MetaMask SDK isn't yet initialized.
   */
  connect: () => Promise<string[] | undefined>;

  /**
   * Indicates whether the user is currently connected to MetaMask.
   */
  connected: boolean;

  /**
   * The address of the connected account, if any.
   */
  account?: Address;

  /**
   * The chain ID of the currently connected network.
   */
  chainId?: string;

  /**
   * A viem WalletClient instance that uses the MetaMask provider as transport.
   */
  walletClient?: WalletClient;

  /**
   * The detected environment (mobile, isMetaMaskInstalled, in-app browser).
   */
  environment: WalletEnvironment;

  /**
   * Deeplink or redirect the user to install/open MetaMask if missing.
   * */
  deeplinkToMetaMask: () => void;

  /**
   * Indicates if the connection flow is still in progress.
   */
  loading: boolean;

  /**
   * Contains any error that occurred during connection (if applicable).
   */
  error?: Error;
}

/**
 * Custom React hook that leverages the MetaMask React SDK
 * along with viem to create a WalletClient for the Polygon Amoy chain.
 *
 * @returns An object with methods and states for handling the MetaMask connection.
 */
export function useMetaMask(): UseMetaMaskReturn {
  const environment = useDetectWalletEnvironment();
  const {
    sdk,
    connected,
    chainId: sdkChainId,
    account,
    connecting,
    error,
    provider,
  } = useSDK();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(`METAMASK ERROR: ${JSON.stringify(error)}`);
    }
  }, [error]);

  /**
   * We define 'connect' as a guaranteed function (non-optional).
   * If the sdk is not ready, this method will throw an error.
   */
  const connect = useCallback(async (): Promise<string[] | undefined> => {
    if (!sdk) {
      throw new Error('MetaMask SDK is not initialized.');
    }
    return sdk.connect();
  }, [sdk]);

  // Generate a viem wallet client using the MetaMask provider, if available.
  const walletClient = provider
    ? createWalletClient({
      chain: polygonAmoy,
      transport: custom(provider),
    })
    : undefined;

  const deeplinkToMetaMask = useCallback(() => {
    // If on mobile but not in MetaMask in-app
    if (environment.isMobile && !environment.isMetaMaskInAppBrowser) {
      // Typically this link either opens or installs the MetaMask app
      window.location.href = 'https://metamask.app.link';
    } else {
      // If on desktop with no extension installed
      window.open('https://metamask.io/download/', '_blank');
    }
  }, [environment.isMobile, environment.isMetaMaskInAppBrowser]);

  return {
    connect,
    connected,
    account: account as Address,
    chainId: sdkChainId,
    walletClient,
    environment,
    deeplinkToMetaMask,
    loading: connecting,
    error,
  };
}
