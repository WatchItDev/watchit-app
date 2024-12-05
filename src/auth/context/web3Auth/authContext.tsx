import React, { createContext } from 'react';
import { AuthContextProps } from './types';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const AuthContextProvider: React.FC<{ web3Auth: any; children: React.ReactNode }> = ({
  web3Auth,
  children,
}) => {
  return <AuthContext.Provider value={{ web3Auth }}>{children}</AuthContext.Provider>;
};
