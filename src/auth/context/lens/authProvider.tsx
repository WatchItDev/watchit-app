import React, { useEffect, useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bindings } from '@lens-protocol/wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { AuthContextProvider } from './authContext';
import { AuthProviderProps } from './types';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { web3AuthOptions } from '@src/auth/web3AuthServices/web3authContext.tsx';
import { polygonAmoy } from "wagmi/chains";

const web3AuthInstance = new Web3Auth(web3AuthOptions);

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  useEffect(() => {
    const configureWeb3Auth = async () => {
      try {
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error('Error inicializando Web3Auth:', error);
      }
    };

    configureWeb3Auth();
  }, []);

  const web3AuthConnector = new Web3AuthConnector({
    web3AuthInstance
  });

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        connectors: [
          web3AuthConnector,
        ],
        chains: [polygonAmoy],
        transports: {
          [polygonAmoy.id]: http(),
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
          <AuthContextProvider web3AuthInstance={web3AuthInstance}>{children}</AuthContextProvider>
        </LensProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
