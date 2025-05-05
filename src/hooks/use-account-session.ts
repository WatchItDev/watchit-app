// REACT IMPORTS
import { useCallback, useEffect, useRef, useState } from 'react';

// REDUX IMPORTS
import { ReduxSession } from '@redux/types.ts';
import { useDispatch } from 'react-redux';
import {
  setAuthLoading,
  setSession,
  setBalance,
  setUser,
  defaultSession, setInfo, closeLoginModal,
} from '@redux/auth';

// VIEM IMPORTS
import { Address } from 'viem';

// WEB3AUTH IMPORTS
import { ADAPTER_EVENTS } from '@web3auth/base';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth';
import { ensureAAReady } from '@src/utils/wallet.ts';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import { useGetUserLazyQuery } from '@src/graphql/generated/hooks';

interface UseAccountSessionHook {
  login: () => Promise<void>;
  logout: (silent?: boolean) => Promise<void>;
  syncAddress: () => Promise<void>;
  loading: boolean;
}

let listenerAttached = false;
let restoreDone      = false;
let loginPerformed   = false;

export const useAccountSession = (): UseAccountSessionHook => {
  const [bootstrapping,   setBootstrapping]   = useState(true);
  const [loginInProgress, setLoginInProgress] = useState(false);

  const dispatch = useDispatch();
  const { web3Auth, bundlerClient, smartAccount } = useWeb3Auth();
  const { isAuthLoading: reduxLoading, session } = useAuth();
  const [loadUser, { data: userData, loading: apiLoading }] = useGetUserLazyQuery({ fetchPolicy: 'cache-and-network' });

  const lastFetchedAddressRef = useRef<Address | undefined>(undefined);
  const userAddressRef        = useRef<Address | undefined>(undefined);
  const sessionRef = useRef(session);


  const getPrimaryAddress = useCallback(async (): Promise<Address | undefined> => {
    const accs = (await web3Auth.provider?.request({ method: 'eth_accounts' })) as string[] | undefined;
    return accs?.[0] as Address | undefined;
  }, [web3Auth.provider]);

  const clearRedux = () => {
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: defaultSession }));
    userAddressRef.current = undefined;
    lastFetchedAddressRef.current = undefined;
    loginPerformed = false;
  };

  const mergeSession = (patch: Partial<ReduxSession>) => {
    const prev = sessionRef.current;
    const next = { ...prev, ...patch };
    next.authenticated = Boolean(next.address && next.user);

    const changed =
      next.address        !== prev.address ||
      next.user           !== prev.user    ||
      next.authenticated  !== prev.authenticated ||
      patch.info !== undefined;

    if (changed) {
      dispatch(setSession({ session: next }));
    }
  };

  const fetchUserInfo = useCallback(async () => {
    const info = await web3Auth.getUserInfo?.();
    return info ?? null;
  }, [web3Auth]);

  const syncAddress = async () => {
    const address = await getPrimaryAddress();
    if (!address) throw new Error('No address found');

    if (!sessionRef.current.info) {
      const info = await fetchUserInfo();
      if (info) dispatch(setInfo({ info }));
    }

    mergeSession({ address });
    loadUser({ variables: { address } });
  };

  const logout = useCallback(async () => {
    if (web3Auth.connected) await web3Auth.logout();
    clearRedux();
  }, [web3Auth]);

  const login = useCallback(async () => {
    if (loginInProgress) return;
    if (loginInProgress || loginPerformed) return;

    setLoginInProgress(true);
    dispatch(setAuthLoading({ isAuthLoading: true }));

    try {
      await web3Auth.connect();
      await ensureAAReady(web3Auth);
      await syncAddress();
      loginPerformed = true;
    } catch (err) {
      dispatch(closeLoginModal());
      throw err;
    } finally {
      setLoginInProgress(false);
      dispatch(setAuthLoading({ isAuthLoading: false }));
    }
  }, [web3Auth, bundlerClient, smartAccount, dispatch, loginInProgress]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    userAddressRef.current = session.user ? session.address : undefined;
  }, [session.user, session.address]);

  useEffect(() => {
    if (!web3Auth || restoreDone) return;
    restoreDone = true;

    (async () => {
      try {
        if (web3Auth.connected) {
          await syncAddress();
        }
      } catch {
        await logout();
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [web3Auth]);

  useEffect(() => {
    if (!web3Auth || listenerAttached) return;
    listenerAttached = true;

    web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, logout);
    web3Auth.on(ADAPTER_EVENTS.CONNECTED,    syncAddress);

    return () => {
      web3Auth.off(ADAPTER_EVENTS.DISCONNECTED, logout);
      web3Auth.off(ADAPTER_EVENTS.CONNECTED,    syncAddress);
      listenerAttached = false;
    };
  }, [web3Auth, logout]);

  useEffect(() => {
    if (userData?.getUser) {
      const address = sessionRef.current.address as Address;

      if (!address) { return; }

      if (userAddressRef.current !== address) {
        userAddressRef.current = address;
        dispatch(setUser({ user: userData.getUser }));
        mergeSession({ user: userData.getUser });
      }
    }
  }, [userData]);

  return {
    login,
    logout,
    syncAddress,
    loading: bootstrapping || reduxLoading || apiLoading || loginInProgress,
  };
};
