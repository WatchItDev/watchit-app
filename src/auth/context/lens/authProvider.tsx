import React, { useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bindings } from '@lens-protocol/wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { AuthContextProvider } from './authContext';
import { AuthProviderProps } from './types';

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        connectors: [coinbaseWallet()],
        chains: [polygonAmoy],
        transports: {
          [polygonAmoy.id]: http('https://polygon-amoy.drpc.org'),
        },
      }),
    []
  );

  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings(wagmiConfig),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <LensProvider config={lensConfig}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </LensProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
