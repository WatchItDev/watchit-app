import React, { PropsWithChildren } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { web3AuthOptions } from "@src/config/web3auth";
import { AuthContextProvider } from "./authContext";
import type { AccountAbstractionProvider } from "@web3auth/modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const FullScreenLoader = styled(Box)({
  position: "fixed",
  inset: 0,
  background: "#1E1F22",
  color: "#fff",
});

const AuthState: React.FC<PropsWithChildren> = ({ children }) => {
  const core        = useWeb3Auth();
  const connectHook = useWeb3AuthConnect();
  const disconnectHook = useWeb3AuthDisconnect();
  const userHook    = useWeb3AuthUser();
  const isReady =
    core.isInitialized ||
    core.status === "ready" ||
    core.status === "connected";

  if (!isReady) return <FullScreenLoader />;

  const aa =
    (core?.web3Auth?.accountAbstractionProvider as AccountAbstractionProvider) ||
    undefined;

  return (
    <AuthContextProvider
      web3Auth={core.web3Auth}
      bundlerClient={aa?.bundlerClient}
      smartAccount={aa?.smartAccount}
      provider={aa?.provider}
      isInitializing={core.isInitializing}
      initError={core.initError}
      {...connectHook}
      {...disconnectHook}
      {...userHook}
    >
      {children}
    </AuthContextProvider>
  );
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <Web3AuthProvider config={{ web3AuthOptions }}>
    <AuthState>{children}</AuthState>
  </Web3AuthProvider>
);
