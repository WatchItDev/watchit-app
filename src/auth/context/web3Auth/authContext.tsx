import React, { createContext } from 'react';
import { AuthContextProps } from './types';
import {Web3Auth} from "@web3auth/modal/dist/types/modalManager"

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const AuthContextProvider: React.FC<{ web3Auth: Web3Auth; children: React.ReactNode }> = ({
  web3Auth,
  children,
}) => {
  return <AuthContext.Provider value={{ web3Auth }}>{children}</AuthContext.Provider>;
};
