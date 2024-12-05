import React, { createContext } from 'react';
import { AuthContextProps, AuthProviderProps } from './types';
import { Web3Auth } from '@web3auth/modal/dist/types/modalManager';
import { type Config } from 'wagmi';

// Create the authentication context
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

/**
 * AuthContextProvider manages authentication state, profiles, and interactions with the Lens Protocol.
 */
export const AuthContextProvider: React.FC<AuthProviderProps & { web3Auth: Web3Auth, wagmiConfig: Config }> = ({ children, web3Auth, wagmiConfig }) => {
  return <AuthContext.Provider value={{ web3Auth, wagmiConfig }}>{children}</AuthContext.Provider>;
};
