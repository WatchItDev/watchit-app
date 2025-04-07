// REACT IMPORTS
import { useEffect, useCallback } from 'react';

// REDUX IMPORTS
import { useDispatch } from 'react-redux';
import { setAuthLoading, setSession, setBalance, setFullyAuthenticated } from '@redux/auth';

// LENS IMPORTS
import { useSession, useLogout } from '@lens-protocol/react-web';

// NOTIFICATIONS IMPORTS
import { notifyWarning } from '@src/libs/notifications/internal-notifications';

// WEB3AUTH IMPORTS
import { useAuth } from '@src/hooks/use-auth.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import { useWeb3Session } from '@src/hooks/use-web3-session';
import { WARNING } from '@src/libs/notifications/warnings.ts';

// ----------------------------------------------------------------------

interface UseAccountSessionHook {
  logout: (silent?: boolean) => void;
  loading: boolean;
}

// ----------------------------------------------------------------------

export const useAccountSession = (): UseAccountSessionHook => {
  const dispatch = useDispatch();
  const { web3Auth } = useWeb3Auth();
  const { execute: lensLogout } = useLogout();
  const { session: sessionData, isSessionLoading } = useAuth();
  const { data, loading } = useSession();
  const { bundlerClient, smartAccount } = useWeb3Session();

  // Decide if Web3Auth is in a connecting state
  const isPending = useCallback(() => {
    return web3Auth.status === 'connecting' || web3Auth.status === 'not_ready';
  }, [web3Auth.status])

  // Decide if Web3Auth is in a valid state
  const isValidWeb3AuthSession = useCallback((): boolean => {
    return (
      web3Auth.connected &&
      web3Auth.status === 'connected' &&
      !!bundlerClient &&
      !!smartAccount
    );
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount]);

  useEffect(() => {
    dispatch(setFullyAuthenticated(
      Boolean(sessionData?.authenticated) && isValidWeb3AuthSession()
    ));
  }, [sessionData?.authenticated, isValidWeb3AuthSession]);

  // If session is invalid or expired, do logout + show error
  const handleSessionExpired = useCallback(async (silent = true) => {
    await lensLogout();
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: { ...data, authenticated: false } }));
    dispatch(setAuthLoading({ isSessionLoading: false }));
    if (!silent) notifyWarning(WARNING.BUNDLER_UNAVAILABLE);
  }, [web3Auth.status]);

  useEffect(() => {
    dispatch(setAuthLoading({
      isSessionLoading: isPending() || loading
    }));
  }, [ isPending, loading ]);

  useEffect(() => {
    // If Web3Auth isn't valid (and not just connecting), expire
    if (!isValidWeb3AuthSession() && !isPending()) {
      handleSessionExpired(false);
      return;
    }

    // wait for web3auth ready state and allow bypass if
    if ((isPending() || loading) && !data?.authenticated) return;
    // is authenticated avoid re-run code below
    if (sessionData?.authenticated || data?.type === 'ANONYMOUS') return;
    // dispatch the session data and turn off the loading
    dispatch(setSession({ session: data }))
    dispatch(setAuthLoading({ isSessionLoading: false }));
  }, [isSessionLoading, data?.authenticated, data?.type]);

  return {
    logout: handleSessionExpired,
    loading: isSessionLoading || isPending() || loading
  };
};
