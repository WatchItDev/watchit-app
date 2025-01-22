// REACT IMPORTS
import { useEffect, useCallback } from 'react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading, setSession, setBalance } from '@redux/auth';

// LENS IMPORTS
import { useSession, useLogout } from '@lens-protocol/react-web';

// NOTIFICATIONS IMPORTS
import { ERRORS } from '@notifications/errors';
import { notifyError } from '@notifications/internal-notifications';

// WEB3AUTH IMPORTS
import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import { useWeb3Session } from '@src/hooks/use-web3-session';

// ----------------------------------------------------------------------

interface UseAccountSessionHook {
  logout: () => Promise<void>;
}

// ----------------------------------------------------------------------

/**
 * This hook consolidates:
 * 1. Lens session fetching & Redux updates.
 * 2. Web3Auth session validation (connected, bundler, smartAccount).
 * 3. LocalStorage expiration checks + auto-logout.
 */
export const useAccountSession = (): UseAccountSessionHook => {
  const dispatch = useDispatch();
  const { execute: lensLogout } = useLogout();
  const { web3Auth } = useWeb3Auth();
  const { data, loading } = useSession();
  const isUpdatingMetadata: boolean = useSelector(
    (state: any) => state.auth.isUpdatingMetadata
  );

  // Update Redux with the current session loading status from Lens
  useEffect(() => {
    dispatch(setAuthLoading({ isSessionLoading: loading }));
  }, [loading]);

  // Convert session data to string so that changes in the object trigger this effect
  const parsedSessionData = JSON.stringify(data);

  // Update Redux session whenever Lens session data changes (unless updating metadata)
  useEffect(() => {
    if (!isUpdatingMetadata) {
      dispatch(setSession({ session: data }));
    }
  }, [parsedSessionData, isUpdatingMetadata]);

  // logout (Lens + Web3Auth)
  const logout = useCallback(async () => {
    try {
      // 1) Logout from Lens
      await lensLogout();
      // 2) Logout from Web3Auth
      await web3Auth?.logout();
      // 3) Clear Redux states or local
      dispatch(setBalance({ balance: 0 }));
      dispatch(setAuthLoading({ isSessionLoading: false }));
      localStorage.removeItem('sessionExpiration');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [lensLogout, web3Auth, dispatch]);

  // Validate Web3Auth Session
  const { bundlerClient, smartAccount } = useWeb3Session();

  const isValidWeb3AuthSession = useCallback((): boolean => {
    // Check that user is connected, status is 'connected', and bundler + smartAccount are available
    return (
      web3Auth.connected &&
      web3Auth.status === 'connected' &&
      !!bundlerClient &&
      !!smartAccount
    );
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount]);

  // Expiration Checks
  const handleSessionExpired = useCallback(() => {
    logout();
    notifyError(ERRORS.BUNDLER_UNAVAILABLE);
  }, [logout]);

  const checkSessionValidity = useCallback(() => {
    console.log('checkSessionValidity')
    // If Web3Auth isn't fully valid, consider session expired
    if (!isValidWeb3AuthSession()) {
      handleSessionExpired();
      return;
    }

    // Otherwise, check localStorage for expiration
    const expirationStr = localStorage.getItem('sessionExpiration');
    if (!expirationStr) return;

    const expirationTime = parseInt(expirationStr, 10);
    if (Date.now() >= expirationTime) {
      handleSessionExpired();
    }
  }, [isValidWeb3AuthSession, handleSessionExpired]);

  const parsedSessionConnected = JSON.stringify(web3Auth.connected);
  const parsedData = JSON.stringify(data);

  // Interval to Check Expiration
  useEffect(() => {
    // Only run the expiration checks if the user is connected
    if (!web3Auth.connected) {
      logout();
      return;
    }
    // if (!web3Auth.connected && data?.authenticated) return handleSessionExpired();
    if (!data?.authenticated) return;

    // Check once immediately
    checkSessionValidity();

    // Then check every 60 seconds
    const intervalId = setInterval(() => {
      checkSessionValidity();
    // }, 60 * 1000);
    }, 5 * 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [parsedSessionConnected, parsedData]);

  return {
    logout,
  };
};
