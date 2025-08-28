// REACT IMPORTS
import React, { useEffect, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

// LOCAL IMPORTS
import { AuthProviderProps } from './types.ts';
import { AuthContextProvider } from './authContext.tsx';
import { initWeb3Auth, web3Auth } from './config/web3AuthInstance.ts';

/**
 * AuthProvider is a higher-order component that wraps the application with necessary providers
 * for state management, wallet connection.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

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
    <AuthContextProvider web3Auth={web3Auth}>{children}</AuthContextProvider>
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
