import React, { useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { bindings } from '@lens-protocol/wagmi';

import { Web3Auth } from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

import { wagmi } from "./config/chainConfig.ts";
import { AuthProviderProps } from './types';
import { AuthContextProvider } from './authContext';
import { web3AuthOptions, modalConfig } from './config/web3authSettings';

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const web3AuthInstance = new Web3Auth(web3AuthOptions);
  const queryClient = new QueryClient();

  // wagmi web3 auth
  const web3AuthConnector = Web3AuthConnector({
    web3AuthInstance,
    modalConfig
  });

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
