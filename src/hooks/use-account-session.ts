// REACT IMPORTS
import { useEffect, useCallback, useState } from 'react';

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
  /**
   * Combined logout for Lens + Web3Auth
   */
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
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

  // LOGOUT (Lens + Web3Auth)
  const logout = useCallback(async () => {
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: { ...data, authenticated: false } }));
    dispatch(setAuthLoading({ isSessionLoading: false }));
  }, [web3Auth.status]);

  const isPending = () => {
    return web3Auth.status === 'connecting' || web3Auth.status === 'not_ready';
  }

  // Decide if Web3Auth is in a valid/connecting state
  const isValidWeb3AuthSession = useCallback((): boolean => {
    // is connecting no update loading
    return web3Auth.connected && web3Auth.status === 'connected' && !!bundlerClient && !!smartAccount;
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount]);

  // If session is invalid or expired, do logout + show error
  const handleSessionExpired = () => {
    logout(); // logout first and notify about expiration
    notifyError(ERRORS.BUNDLER_UNAVAILABLE);
  };

  // Automatic checks on mount + interval
  useEffect(() => {
    // 1) If Web3Auth isn't valid (and not just connecting), expire
    if (!isValidWeb3AuthSession() && !isPending()) {
      handleSessionExpired();
      return;
    }

    // wait for web3auth ready state
    if (isPending() || loading) return;
    // is authenticated avoid re-run code below
    if (sessionData?.authenticated) return;
    // 2) Otherwise, check localStorage for expiration
    dispatch(setSession({ session: data }))
    dispatch(setAuthLoading({ isSessionLoading: false }));
  }, [isSessionLoading]);

  return {
    logout,
    loading: isSessionLoading,
    isAuthenticated: sessionData?.authenticated
  };
};
