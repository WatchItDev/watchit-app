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
    // Early return for SSR (no window object)
    if (typeof window === 'undefined') return;

    // 1) Detect mobile device
    const userAgent = navigator.userAgent || navigator.vendor || '';
    const lowerUA = userAgent.toLowerCase();
    const isMobile = /android|mobile|iphone|ipad|ipod|blackberry|opera mini|iemobile/i.test(lowerUA);

    // 2) Access "ethereum" and analyze it
    const { ethereum } = window as any;
    let isMetaMaskInstalled = false;

    // - Case A: a single provider (not an array of providers)
    if (ethereum && !ethereum.providers) {
      // Check the classic "isMetaMask" flag
      if (ethereum.isMetaMask) {
        isMetaMaskInstalled = true;
      } else {
        // Check for internal "marks" (heuristics)
        // Some older versions might expose ethereum._metamask
        // or ethereum.providerMap?.MetaMask
        if (ethereum._metamask?.isUnlocked !== undefined) {
          // Not 100% official, but sometimes indicates MetaMask
          isMetaMaskInstalled = true;
        }
        if (ethereum.providerMap?.MetaMask) {
          isMetaMaskInstalled = true;
        }
      }
    }

    // - Case B: multiple providers
    if (ethereum && Array.isArray(ethereum.providers)) {
      const metaMaskProvider = ethereum.providers.find((prov: any) => prov.isMetaMask);
      if (metaMaskProvider) {
        isMetaMaskInstalled = true;
      }
    }

    // 3) Determine if it is MetaMask in-app browser (only applies if isMobile + isMetaMaskInstalled)
    //    We can heuristically check if the userAgent includes specific strings
    //    from the mobile MetaMask app, such as "MetaMaskMobile" or "metamask".
    let isMetaMaskInAppBrowser = false;
    if (isMobile && isMetaMaskInstalled) {
      // Simple heuristic
      if (lowerUA.includes('metamask') || lowerUA.includes('metamaskmobile')) {
        isMetaMaskInAppBrowser = true;
      }
    }

    // 4) Update final state
    setEnvironment({
      isMobile,
      isMetaMaskInstalled,
      isMetaMaskInAppBrowser,
    });
  }, []);

  return environment;
}
