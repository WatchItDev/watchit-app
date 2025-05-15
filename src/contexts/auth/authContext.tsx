import React, { createContext, PropsWithChildren } from 'react';
import { AuthContextProps } from './types.ts';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const AuthContextProvider: React.FC<PropsWithChildren<AuthContextProps>> = ({ children, ...props }) => {
  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
};
