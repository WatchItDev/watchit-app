import React, { useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bindings } from '@lens-protocol/wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { AuthContextProvider } from './authContext';
import { AuthProviderProps } from './types';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { web3AuthOptions, modalConfig } from '@src/auth/context/web3Auth/config/web3authSettings.tsx';
import { polygonAmoy } from "wagmi/chains";
// import { MetamaskAdapter } from "@web3auth/metamask-adapter";
// import { chain } from '@src/auth/config/chainConfig.ts';
// import { getInjectedAdapters } from "@web3auth/default-evm-adapter";

const web3AuthInstance = new Web3Auth(web3AuthOptions);

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  // THIS CODE CONNECT METAMASK TO WEB3AUTH
  // const metamaskAdapter = new MetamaskAdapter({
  //   clientId,
  //   sessionTime: 86400, // 1 hour in seconds
  //   web3AuthNetwork: "sapphire_devnet",
  //   chainConfig: chain.polygonAmoy,
  // })
  //
  // web3AuthInstance.configureAdapter(metamaskAdapter);

  // THERE IS ALSO THIS OPTION TO ADD WALLETS TO WEB3AUTH

  // const setUpInjectedAdapters = async () => {
  //   const adapters = await getInjectedAdapters({ options: web3AuthOptions });
  //
  //   adapters.forEach((adapter) => {
  //     web3AuthInstance.configureAdapter(adapter);
  //   });
  // }
  //
  // setUpInjectedAdapters();

  const web3AuthConnector = Web3AuthConnector({
    web3AuthInstance,
    modalConfig
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
        syncConnectedChain: true
      }),
    [web3AuthConnector]
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
