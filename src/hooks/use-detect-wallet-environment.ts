import { useEffect, useState } from 'react';

export interface WalletEnvironment {
  /** Indicates if the user is on a mobile device (based on user agent). */
  isMobile: boolean;
  /** Indicates if MetaMask is installed (`window.ethereum.isMetaMask === true`). */
  isMetaMaskInstalled: boolean;
  /** Indicates if user is likely in MetaMask’s in-app browser (mobile + isMetaMaskInstalled). */
  isMetaMaskInAppBrowser: boolean;
}

export function useDetectWalletEnvironment(): WalletEnvironment {
  const [environment, setEnvironment] = useState<WalletEnvironment>({
    isMobile: false,
    isMetaMaskInstalled: false,
    isMetaMaskInAppBrowser: false,
  });

  useEffect(() => {
    // Make sure we're on a client (browser) environment
    if (typeof window === 'undefined') return;

    // 1) Check user agent for mobile
    const userAgent = navigator.userAgent || navigator.vendor || '';
    const isMobile = /android|mobile|iphone|ipad|ipod|blackberry|opera mini|iemobile/i.test(userAgent);

    // 2) Check if MetaMask is installed
    const ethereum = (window as any).ethereum;
    const isMetaMaskInstalled = Boolean(ethereum && ethereum.isMetaMask);

    // 3) Determine if we’re in MetaMask in-app browser on mobile
    //    (some folks also do userAgent.includes('MetaMaskMobile') as an extra check).
    const isMetaMaskInAppBrowser = isMobile && isMetaMaskInstalled;

    setEnvironment({
      isMobile,
      isMetaMaskInstalled,
      isMetaMaskInAppBrowser,
    });
  }, []);

  return environment;
}
