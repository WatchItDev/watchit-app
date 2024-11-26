// types.ts
import React from 'react';
import { Web3Auth } from '@web3auth/modal/dist/types/modalManager';

/**
 * Interface for profile data used in profile creation and updates.
 */
export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  profileImage: File | string | null;
  backgroundImage: File | string | null;
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
  web3AuthInstance: Web3Auth
}

/**
 * Interface for the authentication provider props.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
