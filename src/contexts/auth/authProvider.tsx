// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

// TODO delete lens provider
// LENS IMPORTS
import { development, LensProvider } from '@lens-protocol/react-web';

// TANSTACK IMPORTS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// LOCAL IMPORTS
import { AuthProviderProps } from './types.ts';
import { AuthContextProvider } from './authContext.tsx';
import { initWeb3Auth, web3Auth } from './config/web3AuthInstance.ts';

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection, and Lens Protocol integration.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const queryClient = new QueryClient();
  const lensConfig = {
    environment: development,
    debug: true,
  };

  useEffect(() => {
    (async () => {
      try {
        await initWeb3Auth();
        setInitialized(true);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('Already connected')) {
          setInitialized(true);
        } else {
          console.error('Error initializing web3Auth:', err);
        }
      }
    })();
  }, []);

  if (!initialized) return <StyledLoaderWrapper />;

  return (
    <QueryClientProvider client={queryClient}>
      <LensProvider config={lensConfig as any}>
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
