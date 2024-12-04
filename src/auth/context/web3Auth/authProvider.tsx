import React, { useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { bindings } from '@lens-protocol/wagmi';

import { AuthProviderProps } from './types';
import { AuthContextProvider } from './authContext';

import { web3AuthConnectorFactory } from "./config/web3AuthSettings";
import { wagmi } from "./config/chainConfig";

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  const queryClient = new QueryClient();
  const [web3AuthInstance, web3AuthConnector] = web3AuthConnectorFactory()

  const wagmiConfig = createConfig({
    syncConnectedChain: true,
    chains: [wagmi.polygonAmoy],
    connectors: [web3AuthConnector],
    transports: { [wagmi.polygonAmoy.id]: http(), }
  })

  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings(wagmiConfig),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <LensProvider config={lensConfig}>
          <AuthContextProvider web3AuthInstance={web3AuthInstance}>{children}</AuthContextProvider>
        </LensProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
