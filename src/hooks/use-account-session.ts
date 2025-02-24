import { useEffect, useCallback } from 'react'
import { useSession, useLogout } from '@lens-protocol/react-web'
import { notifyWarning } from '@notifications/internal-notifications'
import {WARNING} from "@notifications/warnings.ts"
import { setAuthLoading, setSession, setBalance } from '@redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Auth } from '@src/hooks/use-web3-auth'
import { useWeb3Session } from '@src/hooks/use-web3-session'

interface UseAccountSessionHook {
  logout: (silent?: boolean) => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

export const useAccountSession = (): UseAccountSessionHook => {
  const dispatch = useDispatch()
  const { web3Auth } = useWeb3Auth()
  const { execute: lensLogout } = useLogout()
  const sessionData = useSelector((state: any) => state.auth.session)
  const isSessionLoading = useSelector((state: any) => state.auth.isSessionLoading)
  const { data, loading } = useSession()
  const { bundlerClient, smartAccount } = useWeb3Session()

  // Decide if Web3Auth is in a connecting state
  const isPending = () => {
    return web3Auth.status === 'connecting' || web3Auth.status === 'not_ready'
  }

  // Decide if Web3Auth is in a valid state
  const isValidWeb3AuthSession = useCallback((): boolean => {
    return web3Auth.connected && web3Auth.status === 'connected' && !!bundlerClient && !!smartAccount
  }, [web3Auth.connected, web3Auth.status, bundlerClient, smartAccount])

  // If session is invalid or expired, do logout + show error
  const handleSessionExpired = useCallback(async (silent: boolean = true) => {
    await lensLogout()
    dispatch(setBalance({ balance: 0 }))
    dispatch(setSession({ session: { ...data, authenticated: false } }))
    dispatch(setAuthLoading({ isSessionLoading: false }))
    if (!silent) notifyWarning(WARNING.BUNDLER_UNAVAILABLE)
  }, [web3Auth.status])

  // Automatic checks on mount + interval
  useEffect(() => {
    // If Web3Auth isn't valid (and not just connecting), expire
    if (!isValidWeb3AuthSession() && !isPending()) {
      handleSessionExpired(false)
      return
    }

    // wait for web3auth ready state and allow bypass if
    if ((isPending() || loading) && !data?.authenticated) return
    // is authenticated avoid re-run code below
    if (sessionData?.authenticated || data?.type === 'ANONYMOUS') return
    // dispatch the session data and turn off the loading
    dispatch(setSession({ session: data }))
    dispatch(setAuthLoading({ isSessionLoading: false }))
  }, [isSessionLoading, data?.authenticated, data?.type])

  return {
    logout: handleSessionExpired,
    loading: isSessionLoading,
    isAuthenticated: () => sessionData?.authenticated && isValidWeb3AuthSession()
  }
}
