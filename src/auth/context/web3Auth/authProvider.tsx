import React from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { bindings } from '@lens-protocol/wagmi';

import { AuthProviderProps } from './types';
import { AuthContextProvider } from './authContext';
import { web3AuthConnectorFactory } from "./config/web3AuthSettings";
import { polygonAmoy } from "wagmi/chains";

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const queryClient = new QueryClient();
  const [web3Auth, web3AuthConnector] = web3AuthConnectorFactory()

  const wagmiConfig = createConfig({
    syncConnectedChain: true,
    chains: [polygonAmoy],
    pollingInterval: 1000,
    cacheTime: 1_000,
    connectors: [web3AuthConnector],
    transports: { [polygonAmoy.id]: http() }
  })

  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings(wagmiConfig),
    debug: true
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <LensProvider config={lensConfig}>
          <AuthContextProvider web3Auth={web3Auth} wagmiConfig={wagmiConfig}>
            {children}
          </AuthContextProvider>
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
