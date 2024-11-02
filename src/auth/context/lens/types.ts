// types.ts

import { Profile } from '@lens-protocol/react-web';
import React from 'react';

/**
 * Interface for profile data used in profile creation and updates.
 */
export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  profileImage: File | null;
  backgroundImage: File | null;
  socialLinks?: {
    twitter: string;
    instagram: string;
    orb: string;
    farcaster: string;
  };
}

/**
 * Interface for the authentication context.
 */
export interface AuthContextProps {
  authenticated: boolean;
  loading: boolean;
  login: (profile?: Profile) => Promise<void>;
  logout: () => Promise<void>;
  profiles: Profile[];
  selectedProfile?: Profile;
  registerProfile: (data: ProfileData) => Promise<void>;
  selectProfile: (profile: Profile) => void;
  updateProfileMetadata: (data: ProfileData, profile: Profile) => Promise<void>;
  refetchProfiles: () => Promise<void>;
}

/**
 * Interface for the authentication provider props.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
