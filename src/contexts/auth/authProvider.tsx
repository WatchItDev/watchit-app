// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

// LENS IMPORTS
import { development, LensConfig, LensProvider } from '@lens-protocol/react-web';

// TANSTACK IMPORTS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// LOCAL IMPORTS
import { AuthProviderProps } from './types.ts';
import { AuthContextProvider } from './authContext.tsx';
import { initWeb3Auth, web3Auth } from './config/web3AuthInstance.ts';
import { bindings } from './config/bindings.ts';

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const queryClient = new QueryClient();
  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings,
    debug: true,
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await initWeb3Auth();
        setInitialized(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // If the error indicates that the wallet is already connected, we consider the initialization successful.
          if (err.message.includes("Already connected")) {
            setInitialized(true);
          } else {
            console.error('Error initializing web3Auth:', err);
          }
        } else {
          console.error('Unexpected error:', err);
        }
      }
    };

    initialize();
  }, []);

  if (!initialized) return <StyledLoaderWrapper />;

  if (web3Auth.connected) {
    console.log('web3Auth 4')
    web3Auth.getUserInfo().then((info) => console.log('info', info))
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LensProvider config={lensConfig}>
        <AuthContextProvider web3Auth={web3Auth}>
          {children}
        </AuthContextProvider>
      </LensProvider>
    </QueryClientProvider>
  );
};

const StyledLoaderWrapper = styled(Box)(() => ({
  background: '#1E1F22',
  width: '100%',
  height: '100%',
  position: 'absolute',
  left: 0,
  top: 0,
  color: '#fff',
}));
