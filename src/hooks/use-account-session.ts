// REACT IMPORTS
import { useCallback, useEffect, useRef, useState } from 'react';

// REDUX IMPORTS
import { ReduxSession } from '@redux/types.ts';
import { useDispatch } from 'react-redux';
import {
  setAuthLoading,
  setSession,
  setUser,
  defaultSession,
  closeLoginModal,
} from '@redux/auth';

// VIEM IMPORTS
import { Address } from 'viem';

// WEB3AUTH IMPORTS
import { ADAPTER_EVENTS } from '@web3auth/base';

// LOCAL IMPORTS
import { useAuth } from '@src/hooks/use-auth';
import { ensureAAReady } from '@src/utils/wallet';
import { useWeb3Auth } from '@src/hooks/use-web3-auth';
import { useGetUserLazyQuery } from '@src/graphql/generated/hooks';

interface UseAccountSessionHook {
  login:        () => Promise<void>;
  logout:       () => Promise<void>;
  syncAddress:  () => Promise<void>;
  refreshUser:  () => Promise<void>;
  loading:      boolean;
  initializing: boolean;
  userChecked:  boolean;
}

let listenerAttached = false;
let restoreDone      = false;
let loginPerformed   = false;

export const useAccountSession = (): UseAccountSessionHook => {
  const { session, isAuthLoading: reduxLoading } = useAuth();
  const { web3Auth } = useWeb3Auth();
  const dispatch = useDispatch();
  const [loadUser] = useGetUserLazyQuery();

  const [loginInProgress, setLoginInProgress] = useState(false);
  const [verifyingUser,   setVerifyingUser]   = useState(false);
  const [userChecked,     setUserChecked]     = useState(false);
  const [initializing,    setInitializing]    = useState(true);

  const sessionRef       = useRef(session);
  const lastVerifiedRef  = useRef<Address | null>(null);
  const loading = loginInProgress || reduxLoading || verifyingUser;

  const mergeSession = (patch: Partial<ReduxSession>) => {
    const prev = sessionRef.current;
    const derivedAddress = patch.user?.address as Address | undefined;
    const address = patch.address ?? prev.address ?? derivedAddress;
    const user = patch.user ?? prev.user;
    const info = patch.info ?? prev.info;
    const next: ReduxSession = { ...prev, address, user, info, ...patch };
    next.authenticated = Boolean(next.address && next.user && next.info);

    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      sessionRef.current = next;
      dispatch(setSession({ session: next }));
    }
  };

  const getPrimaryAddress = useCallback(async (): Promise<Address | undefined> => {
    const accs = (await web3Auth.provider?.request({ method: 'eth_accounts' })) as string[] | undefined;
    return accs?.[0] as Address | undefined;
  }, [web3Auth.provider]);

  const clearRedux = () => {
    dispatch(setSession({ session: defaultSession }));
    setUserChecked(false);
    loginPerformed = false;
  };

  const syncAddress = async () => {
    const address = await getPrimaryAddress();
    if (!address) throw new Error('No address found');
    if (address === lastVerifiedRef.current && userChecked && !verifyingUser) return;

    lastVerifiedRef.current = address;

    let { info } = sessionRef.current;
    if (!info) info = await web3Auth.getUserInfo?.();

    mergeSession({ address, info });
    setVerifyingUser(true);
    setUserChecked(false);

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
    setVerifyingUser(false);
    setUserChecked(true);
  };

  const refreshUser = async () => {
    const address = await getPrimaryAddress();
    if (!address) throw new Error('No address found');
    const { data } = await loadUser({ variables: { input: { address } } });
    if (data?.getUser) {
      dispatch(setUser({ user: data.getUser }));
      mergeSession({ user: data.getUser });
    }
  };

  const logout = useCallback(async () => {
    await web3Auth.logout?.();
    clearRedux();
    restoreDone = false;
  }, [web3Auth]);

  const login = useCallback(async () => {
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
  }, [web3Auth, loginInProgress]);

  useEffect(() => { sessionRef.current = session }, [session]);

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
      }
    })();
  }, [logout]);

  const handleConnected = async () => {
    try {
      await syncAddress();
    } finally {
      handleReady();
    }
  };

  const handleReady = () => {
    setUserChecked(true);
    setInitializing(false);
  };

  const verifyStatus = () => {
    if (web3Auth.status === 'connected' || web3Auth.status === 'ready') handleReady();
  };

  useEffect(() => {
    if (!web3Auth || listenerAttached) return;
    listenerAttached = true;
    verifyStatus();

    web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, logout);
    web3Auth.on(ADAPTER_EVENTS.CONNECTED,    handleConnected);
    web3Auth.on(ADAPTER_EVENTS.READY,        handleReady);

    return () => {
      web3Auth.off(ADAPTER_EVENTS.DISCONNECTED, logout);
      web3Auth.off(ADAPTER_EVENTS.CONNECTED,    handleConnected);
      web3Auth.off(ADAPTER_EVENTS.READY,        handleReady);
      listenerAttached = false;
    };
  }, [web3Auth, logout]);

  return { login, logout, syncAddress, refreshUser, loading, userChecked, initializing };
};
