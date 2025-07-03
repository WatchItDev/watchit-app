import { createContext, useContext, PropsWithChildren } from "react";
import { AuthContextProps } from "./types";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const AuthContextProvider = ({ children, ...value }: PropsWithChildren<AuthContextProps>) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

export const useWeb3AuthState = () => useContext(AuthContext);
