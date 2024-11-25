import React, { useMemo } from 'react';
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bindings } from '@lens-protocol/wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { AuthContextProvider } from './authContext';
import { AuthProviderProps } from './types';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { WALLET_ADAPTERS } from '@web3auth/base';
import { Web3Auth } from "@web3auth/modal";
import { web3AuthOptions } from '@src/auth/web3AuthServices/web3authContext.tsx';
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

  const modalConfig = {
    [WALLET_ADAPTERS.AUTH]: {
      label: "openlogin",
      loginMethods: {
        facebook: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "facebook login",
          showOnModal: false,
        },
        reddit: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "reddit login",
          showOnModal: false,
        },
        discord: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "discord login",
          showOnModal: false,
        },
        twitch: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "twitch login",
          showOnModal: false,
        },
        apple: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "apple login",
          showOnModal: false,
        },
        line: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "line login",
          showOnModal: false,
        },
        github: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "github login",
          showOnModal: false,
        },
        kakao: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "kakao login",
          showOnModal: false,
        },
        linkedin: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "linkedin login",
          showOnModal: false,
        },
        twitter: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "twitter login",
          showOnModal: false,
        },
        wechat: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "wechat login",
          showOnModal: false,
        },
        weibo: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "weibo login",
          showOnModal: false,
        },
        farcaster: {
          // it will hide the facebook option from the Web3Auth modal.
          name: "farcaster login",
          showOnModal: false,
        }
      },
      // setting it to false will hide all social login methods from modal.
      showOnModal: true,
    },
  }

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
