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

interface UseAccountSessionProps {
  /**
   * Whether to automatically run the expiration checks
   * on mount + every interval (default: true).
   */
  autoCheck?: boolean;
}

interface UseAccountSessionHook {
  /**
   * Combined logout for Lens + Web3Auth
   */
  logout: () => Promise<void>;

  /**
   * Check session validity on demand:
   *  - Verifies Web3Auth is fully connected (or still connecting)
   *  - Verifies localStorage expiration
   *  - Logs out + notifies error if invalid
   */
  checkSessionValidity: () => void;
}

// ----------------------------------------------------------------------

/**
 * This hook consolidates:
 * 1. Lens session fetching & Redux updates.
 * 2. Web3Auth session validation (connected, bundler, smartAccount).
 * 3. LocalStorage expiration checks + auto-logout (optionally).
 *
 * If `autoCheck` is false, the hook won't run the checks automatically,
 * but you can still call `checkSessionValidity()` manually.
 */
export const useAccountSession = (
  { autoCheck = true }: UseAccountSessionProps = {}
): UseAccountSessionHook => {
  const dispatch = useDispatch();
  const { execute: lensLogout } = useLogout();
  const { web3Auth } = useWeb3Auth();
  const { data, loading } = useSession();
  const isUpdatingMetadata: boolean = useSelector(
    (state: any) => state.auth.isUpdatingMetadata
  );
  const { bundlerClient, smartAccount } = useWeb3Session();

  const parsedSessionConnected = JSON.stringify(web3Auth.connected);
  const parsedSessionData = JSON.stringify(data);

  // Keep Redux in sync with Lens loading state
  useEffect(() => {
    // If autoCheck is disabled, skip
    if (!autoCheck) return;
    dispatch(setAuthLoading({ isSessionLoading: loading }));
  }, [loading, autoCheck]);

  // Keep Redux in sync with actual Lens session data
  useEffect(() => {
    // If autoCheck is disabled, skip
    if (!autoCheck) return;
    if (!isUpdatingMetadata) {
      dispatch(setSession({ session: data }));
    }
  }, [parsedSessionData, isUpdatingMetadata, autoCheck]);

  // LOGOUT (Lens + Web3Auth)
  const logout = useCallback(async () => {
    try {
      // 1) Logout from Lens
      await lensLogout();
      // 2) Logout from Web3Auth
      await web3Auth?.logout();
      // 3) Clear Redux state & localStorage
      dispatch(setBalance({ balance: 0 }));
      localStorage.removeItem('sessionExpiration');
    } catch (err) {
      console.error('Error during logout:', err);
      localStorage.removeItem('sessionExpiration');
    }
  }, [lensLogout, web3Auth, dispatch]);

  // Decide if Web3Auth is in a valid/connecting state
  const isValidWeb3AuthSession = useCallback((): boolean => {
    const isConnecting =
      web3Auth.status === 'connecting' ||
      web3Auth.status === 'not_ready';

    const isFullyValid =
      web3Auth.connected &&
      web3Auth.status === 'connected' &&
      !!bundlerClient &&
      !!smartAccount;

    console.log('isValidWeb3AuthSession')
    console.log(isConnecting)
    console.log(isFullyValid)
    console.log(isConnecting || isFullyValid)

    // Return true if either "still connecting" or "fully valid"
    return isConnecting || isFullyValid;
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount]);

  // If session is invalid or expired, do logout + show error
  const handleSessionExpired = useCallback(() => {
    logout();
    notifyError(ERRORS.BUNDLER_UNAVAILABLE);
  }, [logout]);

  const checkSessionValidity = useCallback(() => {
    console.log('checkSessionValidity')
    // 1) If Web3Auth isn't valid (and not just connecting), expire
    if (!isValidWeb3AuthSession()) {
      handleSessionExpired();
      return;
    }

    // 2) Otherwise, check localStorage for expiration
    const expirationStr = localStorage.getItem('sessionExpiration');
    if (!expirationStr) return;

    const expirationTime = parseInt(expirationStr, 10);
    if (Date.now() >= expirationTime) {
      handleSessionExpired();
    }
  }, [isValidWeb3AuthSession, handleSessionExpired]);

  // Automatic checks on mount + interval
  useEffect(() => {
    // If autoCheck is disabled, skip
    if (!autoCheck) return;

    // If Lens or Web3Auth is still loading, skip checks until loaded
    if (loading || web3Auth.status === 'connecting' || web3Auth.status === 'not_ready') return;

    // If user is not authenticated in Lens, skip
    if (!data?.authenticated) {
      return;
    }

    // If Web3Auth is in "ready" state but not connected, log out
    // (meaning: it's done with any connecting state, but the user is not actually connected)
    if (!web3Auth.connected && web3Auth.status === 'ready') {
      logout();
      return;
    }

    // Check once immediately
    checkSessionValidity();

    // Then check every 60 seconds
    const intervalId = setInterval(() => {
      checkSessionValidity();
    }, 60 * 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [
    autoCheck,
    loading,
    parsedSessionConnected,
    parsedSessionData
  ]);

  return {
    logout,
    checkSessionValidity,
  };
};
