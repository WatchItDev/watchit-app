import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Profile,
  SessionType,
  useCreateProfile,
  useLogin,
  useLogout,
  useLazyProfilesManaged,
  useSession,
  useSetProfileMetadata,
} from '@lens-protocol/react-web';
import { useAccount } from 'wagmi';
import { AuthContextProps, AuthProviderProps, ProfileData } from './types';
import { uploadImagesToIPFS, uploadImageToIPFS, uploadMetadataToIPFS } from '../../../utils/ipfs';
import { buildProfileMetadata } from '../../../utils/profile';

// Create the authentication context
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

/**
 * AuthContextProvider manages authentication state, profiles, and interactions with the Lens Protocol.
 */
export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State variables

  // Authentication status
  const [authenticated, setAuthenticated] = useState(false);

  // Registration loader
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // List of profiles associated with the connected wallet
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Currently selected profile
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);

  // Pending metadata update (used when profile creation requires authentication)
  const [pendingMetadataUpdate, setPendingMetadataUpdate] = useState<{
    data: ProfileData;
    profile: Profile;
  } | null>(null);

  // Hooks

  // Session data from Lens Protocol
  const { data: sessionData, error: sessionError, loading: sessionLoading } = useSession();

  // Login and logout functions from Lens Protocol
  const { execute: loginExecute, loading: loginLoading } = useLogin();
  const { execute: logoutExecute, loading: logoutLoading } = useLogout();

  // Wallet address and connection status from Wagmi
  const { address, isConnecting } = useAccount();

  // Fetch profiles associated with the connected wallet
  const {
    execute: fetchProfiles,
    data: profileData,
    loading: profilesLoading,
    called: profilesCalled,
  } = useLazyProfilesManaged();

  // Create profile and set profile metadata functions from Lens Protocol
  const { execute: createProfileExecute, loading: createProfileLoading } = useCreateProfile();
  const { execute: setProfileMetadataExecute, loading: setProfileMetadataLoading } = useSetProfileMetadata();

  // Fetch profiles when the wallet address changes
  useEffect(() => {
    if (address && !profilesLoading && !profilesCalled) {
      fetchProfiles({
        for: address,
        includeOwned: true,
      });
    }
  }, [address, fetchProfiles, profilesLoading, profilesCalled]);

  // Update profiles state when profileData changes
  useEffect(() => {
    if (profileData?.length) {
      setProfiles(profileData);
    } else {
      setProfiles([]);
    }
  }, [profileData]);

  /**
   * Log in using the selected profile.
   */
  const login = useCallback(
    async (profile?: Profile) => {
      const profileToUse = profile || selectedProfile;

      if (!profileToUse) {
        console.warn('No profile selected or provided, please select one.');
        return;
      }

      if (!address) {
        console.error('Wallet address not available.');
        return;
      }

      try {
        const result = await loginExecute({
          address,
          profileId: profileToUse.id,
        } as any);

        if (result.isFailure()) {
          console.error('Error during login:', result.error.message);
        } else {
          console.log('Login initiated.');
          // The session change will be handled by useEffect
        }
      } catch (err) {
        console.error('Error in login:', err);
      }
    },
    [selectedProfile, loginExecute, address]
  );

  /**
   * Log out from the current session.
   */
  const logout = useCallback(async () => {
    try {
      await logoutExecute();
      setAuthenticated(false);
      setSelectedProfile(undefined);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, [logoutExecute]);

  /**
   * Select a profile from the list of profiles.
   * @param profile - The profile to select.
   */
  const selectProfile = useCallback((profile: Profile) => {
    console.log('Setting selected profile');
    setSelectedProfile(profile);
  }, []);

  const refetchProfiles = useCallback(async () => {
    if (!address) {
      console.error('Wallet address not available.');
      return;
    }
    try {
      await fetchProfiles({
        for: address,
        includeOwned: true,
      });
    } catch (error) {
      console.error('Error re-fetching profiles:', error);
    }
  }, [address, fetchProfiles]);


  /**
   * Update profile metadata on the Lens Protocol.
   * @param data - Profile data to update.
   * @param profile - Profile to update.
   */
  const updateProfileMetadata = useCallback(
    async (data: ProfileData, profile: Profile) => {
      console.log('Updating profile metadata');
      setRegistrationLoading(true);

      try {
        // Upload images to IPFS
        const profileImageURI = typeof data?.profileImage === 'string' ? data?.profileImage : await uploadImageToIPFS(data.profileImage);
        const backgroundImageURI = typeof data?.backgroundImage === 'string' ? data?.backgroundImage : await uploadImageToIPFS(data.backgroundImage);

        // Build profile metadata
        const metadata = buildProfileMetadata(data, profileImageURI, backgroundImageURI);
        console.log('Metadata:', metadata);

        // Upload metadata to IPFS
        const metadataURI = await uploadMetadataToIPFS(metadata);
        console.log('Metadata URI:', metadataURI);

        // Update metadata on the Lens Protocol
        const result = await setProfileMetadataExecute({ metadataURI });

        if (result.isFailure()) {
          console.error('Failed to update metadata:', result.error.message);
          return;
        }

        console.log('Metadata updated, waiting for completion.');

        // Wait for the transaction to be processed
        const completion = await result.value.waitForCompletion();

        if (completion.isFailure()) {
          console.error('Error processing the transaction:', completion.error.message);
          return;
        }

        console.log('Metadata updated successfully.');

        if (!address) return;

        // Refresh profiles and select the updated one
        await fetchProfiles({
          for: address,
          includeOwned: true,
        });

        const updatedProfile = profileData?.find((p) => p.id === profile.id);

        if (updatedProfile) selectProfile(updatedProfile);

        setRegistrationLoading(false);
      } catch (error) {
        console.error('Error updating profile metadata:', error);
        setRegistrationLoading(false);
      }
    },
    [
      setProfileMetadataExecute,
      fetchProfiles,
      address,
      profileData,
      selectProfile
    ]
  );

  /**
   * Register a new profile on the Lens Protocol.
   * @param data - Profile data for the new profile.
   */
  const registerProfile = useCallback(
    async (data: ProfileData) => {
      if (!address) {
        console.error('Wallet address not available.');
        return;
      }

      try {
        setRegistrationLoading(true);
        console.log('Creating new profile...');
        console.log(data);
        console.log(address);

        const result = await createProfileExecute({
          localName: data.username,
          to: address,
        });

        console.log('hello result')
        console.log(result)

        if (result.isFailure()) {
          throw new Error(result.error.message);
        }

        const newProfile: Profile = result.value;

        // Authenticate using the new profile
        await login(newProfile);

        // Save the pending metadata update
        setPendingMetadataUpdate({ data, profile: newProfile });

        console.log('Authentication initiated. Metadata update will resume once authenticated.');
      } catch (error) {
        console.error('Error during profile registration:', error);
        setRegistrationLoading(false);
        throw error;
      }
    },
    [address, createProfileExecute, login]
  );

  // Handle session changes and resume pending metadata updates
  useEffect(() => {
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

    // Resume metadata update if pending and authenticated
    if (
      sessionData &&
      sessionData.type === SessionType.WithProfile &&
      pendingMetadataUpdate
    ) {
      console.log('Session is active. Resuming metadata update...');
      updateProfileMetadata(
        pendingMetadataUpdate.data,
        sessionData.profile
      );
      setPendingMetadataUpdate(null); // Clear the pending update
    }
  }, [
    sessionData,
    sessionError,
    sessionLoading,
    pendingMetadataUpdate,
    updateProfileMetadata,
  ]);

  // Compute the loading state
  const loading = useMemo(
    () =>
      sessionLoading ||
      profilesLoading ||
      loginLoading ||
      logoutLoading ||
      isConnecting ||
      createProfileLoading ||
      registrationLoading ||
      setProfileMetadataLoading,
    [
      sessionLoading,
      profilesLoading,
      loginLoading,
      logoutLoading,
      isConnecting,
      createProfileLoading,
      registrationLoading,
      setProfileMetadataLoading,
    ]
  );

  // Context value
  const value = useMemo(
    () => ({
      authenticated,
      loading,
      login,
      logout,
      profiles,
      selectedProfile,
      registerProfile,
      selectProfile,
      updateProfileMetadata,
      refetchProfiles,
    }),
    [
      authenticated,
      loading,
      login,
      logout,
      profiles,
      selectedProfile,
      registerProfile,
      selectProfile,
      updateProfileMetadata,
      refetchProfiles,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
