import React, { createContext } from 'react';
import { AuthContextProps, AuthProviderProps } from './types';
import { Web3Auth } from '@web3auth/modal/dist/types/modalManager';

// Create the authentication context
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

/**
 * AuthContextProvider manages authentication state, profiles, and interactions with the Lens Protocol.
 */
export const AuthContextProvider: React.FC<AuthProviderProps & { web3Auth: Web3Auth }> = ({ children, web3Auth }) => {
  return <AuthContext.Provider value={{ web3Auth }}>{children}</AuthContext.Provider>;
};
