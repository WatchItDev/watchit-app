import React, { useEffect } from 'react'
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './authContext'
import { bindings } from './config/bindings'
import { initWeb3Auth, web3Auth } from './config/web3AuthInstance'
import { AuthProviderProps } from './types'

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = new QueryClient()
  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings,
    debug: true,
  }

  useEffect(() => {
    initWeb3Auth()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <LensProvider config={lensConfig}>
        <AuthContextProvider web3Auth={web3Auth}>{children}</AuthContextProvider>
      </LensProvider>
    </QueryClientProvider>
  )
}
