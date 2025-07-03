// -----------------------------------------------------------------------------
// use-account-session.ts
// Centralised session manager for Web3Auth v10 + Account Abstraction
// (con guards globales y recuperación explícita de userInfo)
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Address, EIP1193Provider } from 'viem';
import { useDispatch } from 'react-redux';
import {
  defaultSession,
  setAuthLoading,
  setBalance,
  setSession,
  setUser,
} from '@redux/auth';

import { useAuth } from '@src/hooks/use-auth';
import { ensureAAReady } from '@src/utils/wallet';
import { useGetUserLazyQuery } from '@src/graphql/generated/hooks';
import { useWeb3AuthState } from '@src/contexts/auth/authContext.tsx';

// -----------------------------------------------------------------------------
// Guards compartidos por TODAS las instancias del hook
// -----------------------------------------------------------------------------
let loginRunning   = false;                  // evita logins simultáneos
let loginCompleted = false;                  // marca login exitoso
let syncDoneForAddr: Address | null = null;  // evita syncAddress duplicados

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface UseAccountSessionHook {
  login(): Promise<void>;
  logout(): Promise<void>;
  syncAddress(): Promise<void>;
  refreshUser(): Promise<void>;
  loading: boolean;
  initializing: boolean;
  userChecked: boolean;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------
export const useAccountSession = (): UseAccountSessionHook => {
  // ────────────────────────────────────────────────────────────────────────────
  // Web3Auth SDK
  // ────────────────────────────────────────────────────────────────────────────
  const {
    web3Auth,
    provider,
    connect,
    disconnect,
    status,
    isInitialized,
    userInfo,
    isInitializing,
    initError
  } = useWeb3AuthState();

  // ────────────────────────────────────────────────────────────────────────────
  // Redux & GraphQL
  // ────────────────────────────────────────────────────────────────────────────
  const dispatch = useDispatch();
  const [loadUser] = useGetUserLazyQuery();
  const { session, isAuthLoading } = useAuth();

  // ────────────────────────────────────────────────────────────────────────────
  // Refs & State
  // ────────────────────────────────────────────────────────────────────────────
  const sessionRef = useRef(session);
  const [initializing, setInitializing] = useState(true);
  const [verifying,    setVerifying   ] = useState(false);
  const [userChecked,  setUserChecked ] = useState(false);

  const loading = isAuthLoading || verifying;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const mergeSession = (patch: Partial<typeof session>) => {
    const prev = sessionRef.current;
    const next = { ...prev, ...patch };
    next.authenticated = Boolean(next.address && next.user && next.info);

    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      sessionRef.current = next;
      dispatch(setSession({ session: next }));
    }
  };

  const getPrimaryAddress = useCallback(async (): Promise<Address | undefined> => {
    if (!provider) return;
    const accs = await (provider as EIP1193Provider).request({
      method: 'eth_accounts',
    }) as string[];
    return accs?.[0] as Address | undefined;
  }, [provider]);

  const clearRedux = () => {
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: defaultSession }));
    setUserChecked(false);
    loginCompleted = false;
    syncDoneForAddr = null;
  };

  // ---------------------------------------------------------------------------
  // Core helpers
  // ---------------------------------------------------------------------------
  const syncAddress = useCallback(async () => {
    const address = await getPrimaryAddress();
    if (!address) throw new Error('No address found');

    // Evita verificaciones repetidas para la misma cuenta
    if (address === syncDoneForAddr) return;
    syncDoneForAddr = address;

    // ── Obtener info de usuario ───────────────────────────────────────────────
    let info = sessionRef.current.info ?? userInfo ?? undefined;

    if (!info && web3Auth?.getUserInfo) {
      try {
        info = await web3Auth.getUserInfo();
      } catch (e) {
        console.error('getUserInfo failed', e);
      }
    }

    mergeSession({ address, info });

    setVerifying(true);
    try {
      const { data } = await loadUser({
        variables: { input: { address, idSession: info?.idToken } },
      });

      if (data?.getUser) {
        dispatch(setUser({ user: data.getUser }));
        mergeSession({
          user: data.getUser,
          address: data.getUser.address as Address,
        });
      }
    } catch (err) {
      console.error('loadUser failed', err);
    } finally {
      setVerifying(false);
      setUserChecked(true);
    }
  }, [userInfo, web3Auth]);

  const refreshUser = useCallback(async () => {
    const address = await getPrimaryAddress();
    if (!address) return;

    try {
      const { data } = await loadUser({ variables: { input: { address } } });
      if (data?.getUser) {
        dispatch(setUser({ user: data.getUser }));
        mergeSession({ user: data.getUser });
      }
    } catch (err) {
      console.error('refreshUser failed', err);
    }
  }, [getPrimaryAddress]);

  // ---------------------------------------------------------------------------
  // Public actions
  // ---------------------------------------------------------------------------
  const login = useCallback(async () => {
    if (loginRunning || loginCompleted) return;

    loginRunning = true;
    dispatch(setAuthLoading({ isAuthLoading: true }));
    try {
      // await waitForReady();
      console.log('isInitialized login:', isInitialized);
      console.log('status login:', status);
      console.log('web3Auth?.status login:', web3Auth?.status);
      console.log('web3Auth?.status login:', web3Auth);
      await connect();
      await ensureAAReady(web3Auth);
      await syncAddress();
      loginCompleted = true;
    } finally {
      dispatch(setAuthLoading({ isAuthLoading: false }));
      loginRunning = false;
    }
  }, [web3Auth]);

  const logout = useCallback(async () => {
    await disconnect();
    clearRedux();
  }, [web3Auth]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => { sessionRef.current = session; }, [session]);

  useEffect(() => {
    if (session.authenticated) setInitializing(false);
  }, [session.authenticated]);

  useEffect(() => {
    if (initError) {
      console.log('isInitialized:', isInitialized);
      console.log('status:', status);
      console.log('web3Auth?.status:', web3Auth?.status);
      console.error('Web3Auth init error:', initError);
      console.log(initError);
      console.log(JSON.stringify(initError));
      setInitializing(false);
      // logout();
      return;
    }

    // Restaurar sesión si ya está conectada
    if (status === 'connected') {
      if (!loginCompleted && !loginRunning) {
        (async () => {
          loginRunning = true;
          try {
            await ensureAAReady(web3Auth);
            await syncAddress();
            loginCompleted = true;
          } catch (err) {
            console.error(err);
          } finally {
            loginRunning = false;
            setInitializing(false);
          }
        })();
      }
      setInitializing(false);
      return;
    }

    if (status === 'ready' || status === 'disconnected') {
      setInitializing(false);
    }
  }, [status, initError, web3Auth, syncAddress]);

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------
  return {
    login,
    logout,
    syncAddress,
    refreshUser,
    loading,
    initializing: isInitializing,
    userChecked,
  };
};
