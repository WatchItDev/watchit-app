import { useCallback, useEffect, useRef, useState } from "react";
import type { Address, EIP1193Provider } from "viem";
import { useDispatch } from "react-redux";
import {
  setAuthLoading,
  setBalance,
  setSession,
  setUser,
  defaultSession,
} from "@redux/auth";
import { useAuth } from "@src/hooks/use-auth";
import { ensureAAReady } from "@src/utils/wallet";
import { useGetUserLazyQuery } from "@src/graphql/generated/hooks";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";

interface UseAccountSessionHook {
  login(): Promise<void>;
  logout(): Promise<void>;
  syncAddress(): Promise<void>;
  refreshUser(): Promise<void>;
  loading: boolean;
  initializing: boolean;
  userChecked: boolean;
}

export const useAccountSession = (): UseAccountSessionHook => {
  const { provider, web3Auth, status, initError } = useWeb3Auth();
  const { connect,   loading: connectLoading } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { session, isAuthLoading }  = useAuth();
  const [loadUser]                  = useGetUserLazyQuery();
  const dispatch = useDispatch();

  const [initializing, setInitializing] = useState(true);
  const [verifying,    setVerifying]    = useState(false);
  const [userChecked,  setUserChecked]  = useState(false);

  const sessionRef   = useRef(session);
  const lastAddrRef  = useRef<Address | null>(null);

  const loading = connectLoading || disconnectLoading || isAuthLoading || verifying;

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
    const accounts = await (provider as EIP1193Provider).request({
      method: "eth_accounts",
    }) as string[];
    return accounts[0] as Address | undefined;
  }, [provider]);

  const clearRedux = () => {
    dispatch(setBalance({ balance: 0 }));
    dispatch(setSession({ session: defaultSession }));
    setUserChecked(false);
  };

  const syncAddress = useCallback(async () => {
    const addr = await getPrimaryAddress();
    if (!addr) throw new Error("No address");

    if (addr === lastAddrRef.current && userChecked && !verifying) return;
    lastAddrRef.current = addr;

    let info = sessionRef.current.info;
    if (!info) info = userInfo ?? undefined;
    mergeSession({ address: addr, info });

    setVerifying(true);
    const { data } = await loadUser({
      variables: { input: { address: addr, idSession: info?.idToken } },
    });
    if (data?.getUser) {
      dispatch(setUser({ user: data.getUser }));
      mergeSession({ user: data.getUser, address: data.getUser.address as Address });
    }
    setVerifying(false);
    setUserChecked(true);
  }, [getPrimaryAddress, loadUser, userInfo, userChecked, verifying]);

  const login = useCallback(async () => {
    dispatch(setAuthLoading({ isAuthLoading: true }));
    try {
      await connect();
      await ensureAAReady(web3Auth);
      await syncAddress();
    } finally {
      dispatch(setAuthLoading({ isAuthLoading: false }));
    }
  }, [connect, syncAddress, web3Auth, dispatch]);

  const logout = useCallback(async () => {
    await disconnect();
    clearRedux();
  }, [disconnect]);

  const refreshUser = useCallback(async () => {
    const addr = await getPrimaryAddress();
    if (!addr) return;
    const { data } = await loadUser({ variables: { input: { address: addr } } });
    if (data?.getUser) {
      dispatch(setUser({ user: data.getUser }));
      mergeSession({ user: data.getUser });
    }
  }, [getPrimaryAddress, loadUser]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (initError) console.error("Web3Auth init error:", initError);

    (async () => {
      if (status === "connected") {
        await ensureAAReady(web3Auth);
        await syncAddress();
        setInitializing(false);
      }
      if (status === "ready")        setInitializing(false);
      if (status === "disconnected") {
        clearRedux();
        setInitializing(false);
      }
    })().catch(console.error);
  }, [status, initError, web3Auth, syncAddress]);

  return {
    login,
    logout,
    syncAddress,
    refreshUser,
    loading,
    initializing,
    userChecked,
  };
};
