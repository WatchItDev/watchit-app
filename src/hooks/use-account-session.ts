// REACT IMPORTS
import { useEffect, useCallback } from 'react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading, setSession, setBalance } from '@redux/auth';

// LENS IMPORTS
import { useSession } from '@lens-protocol/react-web';

// NOTIFICATIONS IMPORTS
import { ERRORS } from '@notifications/errors';
import { notifyError } from '@notifications/internal-notifications';

// WEB3AUTH IMPORTS
import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import { useWeb3Session } from '@src/hooks/use-web3-session';

// ----------------------------------------------------------------------

interface UseAccountSessionHook {
  /**
   * Combined logout for Lens + Web3Auth
   */
  logout: (silent?: boolean) => void;
  loading: boolean;
  isAuthenticated: () => boolean;
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
export const useAccountSession = (): UseAccountSessionHook => {
  const dispatch = useDispatch();
  const { web3Auth } = useWeb3Auth();
  const sessionData = useSelector((state: any) => state.auth.session);
  const isSessionLoading = useSelector((state: any) => state.auth.isSessionLoading);
  const { data, loading } = useSession();
  const { bundlerClient, smartAccount } = useWeb3Session();

  const isPending = () => {
    return web3Auth.status === 'connecting' || web3Auth.status === 'not_ready';
  }

  // Decide if Web3Auth is in a valid/connecting state
  const isValidWeb3AuthSession = useCallback((): boolean => {
    // is connecting no update loading
    return web3Auth.connected && web3Auth.status === 'connected' && !!bundlerClient && !!smartAccount;
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount]);

  // If session is invalid or expired, do logout + show error
  const handleSessionExpired = useCallback((silent: boolean = true) => {
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: { ...data, authenticated: false } }));
    dispatch(setAuthLoading({ isSessionLoading: false }));
    if (silent) notifyError(ERRORS.BUNDLER_UNAVAILABLE);
  }, [web3Auth.status]);

  // Automatic checks on mount + interval
  useEffect(() => {
    // 1) If Web3Auth isn't valid (and not just connecting), expire
    if (!isValidWeb3AuthSession() && !isPending()) {
      handleSessionExpired(false);
      return;
    }

    // wait for web3auth ready state and allow bypass if
    if ((isPending() || loading) && !data?.authenticated) return;
    // is authenticated avoid re-run code below
    if (sessionData?.authenticated) return;
    // 2) Otherwise, check localStorage for expiration
    dispatch(setSession({ session: data }))
    dispatch(setAuthLoading({ isSessionLoading: false }));
  }, [isSessionLoading]);

  return {
    logout: handleSessionExpired,
    loading: isSessionLoading,
    isAuthenticated: () => sessionData?.authenticated && isValidWeb3AuthSession()
  };
};
