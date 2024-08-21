// REACT IMPORTS
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

// LENS IMPORTS
import {
  useSession,
  useLogin,
  useLogout,
  useProfilesManaged,
  Profile,
  SessionType,
  LensProvider,
  LensConfig,
  development
} from '@lens-protocol/react-web';
import {
  LensClient,
  isRelaySuccess,
  development as clientDevelopment
} from '@lens-protocol/client';
import { bindings } from '@lens-protocol/wagmi';

// TANSTACK IMPORTS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// WAGMI IMPORTS
import { WagmiProvider, createConfig, http, useAccount } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// ----------------------------------------------------------------------

// Define the interface for the authentication context
export interface AuthContextProps {
  authenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  profiles: Profile[];
  selectedProfile?: Profile;
  registerProfile: (username: string) => Promise<void>;
  selectProfile: (profile: Profile) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// ----------------------------------------------------------------------

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // states
  const [authenticated, setAuthenticated] = useState(false);
  const [profiles, setProfiles] = useState<any>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(undefined);

  // hooks
  const { data: sessionData, error: sessionError, loading: sessionLoading } : any = useSession();
  const { execute: loginExecute, loading: loginLoading } = useLogin();
  const { execute: logoutExecute, loading: logoutLoading } = useLogout();
  const { address, isConnecting }: any = useAccount();
  const { data: profileData, loading: profilesLoading } = useProfilesManaged({
    for: address,
    includeOwned: true,
  });

  const client: any = useMemo(() => new LensClient({ environment: clientDevelopment }), []);

  useEffect(() => {
    if (profileData?.length) setProfiles(profileData);
  }, [profileData]);

  useEffect(() => {
    if (address && client) {
      client.profile.fetchAll({ where: { ownedBy: [address!] } })
        .then((response: any) => {
          if (response.items.length) setProfiles(response.items);
        });
    }
  }, [address, client]);

  const handleSession = useCallback(() => {
    if (sessionLoading) return;

    if (sessionError) {
      setAuthenticated(false);
      console.error('Session error:', sessionError);
      return;
    }

    if (sessionData) {
      switch (sessionData.type) {
        case SessionType.Anonymous:
        case SessionType.JustWallet:
          setAuthenticated(false);
          break;
        case SessionType.WithProfile:
          setAuthenticated(true);
          setSelectedProfile(sessionData.profile);
          break;
        default:
          console.error('Unknown session type:', sessionData);
      }
    }
  }, [sessionData, sessionError, sessionLoading]);

  useEffect(() => {
    handleSession();

    const intervalId = setInterval(() => {
      handleSession();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [handleSession]);

  const selectProfile = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
  }, []);

  const registerProfile = useCallback(async (username: string) => {
    try {
      const result: any = await client.wallet.createProfileWithHandle({
        handle: username,
        to: address!,
      });

      if (isRelaySuccess(result)) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log('Profile successfully created');

        const updatedProfiles = await client.profile.fetchAll({
          where: {
            ownedBy: [address!],
          },
        });

        setProfiles(updatedProfiles.items);
      } else {
        console.error('Profile registration failed:', result);
      }
    } catch (error) {
      console.error('Error registering profile:', error);
    }
  }, [address, client]);

  const login = useCallback(async () => {
    if (!selectedProfile) {
      console.warn('No profile selected, please select one.')
      return
    }

    try {
      const result: any = await loginExecute({
        address: address!,
        profileId: selectedProfile.id,
      } as any);

      if (result.isSuccess()) {
        setAuthenticated(true);
      } else {
        console.error(result?.error?.message);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [selectedProfile, loginExecute, address]);


  const logout = useCallback(async () => {
    try {
      await logoutExecute();
      setAuthenticated(false);
      setSelectedProfile(undefined);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [logoutExecute]);

  const loading = useMemo(() =>
    sessionLoading || profilesLoading || loginLoading || logoutLoading || isConnecting,
    [sessionLoading, profilesLoading, loginLoading, logoutLoading, isConnecting]
  );

  const value = useMemo(() => ({
    authenticated,
    loading,
    login,
    logout,
    profiles,
    selectedProfile,
    registerProfile,
    selectProfile,
  }), [authenticated, loading, login, logout, profiles, selectedProfile, registerProfile, selectProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------------------------------------------------

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  const wagmiConfig = useMemo(() => createConfig({
    connectors: [
      // metaMask(),
      coinbaseWallet(),
    ],
    chains: [polygonAmoy],
    transports: {
      [polygonAmoy.id]: http(),
    },
  }), []);

  const lensConfig: LensConfig = {
    environment: development,
    bindings: bindings(wagmiConfig),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <LensProvider config={lensConfig}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </LensProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
