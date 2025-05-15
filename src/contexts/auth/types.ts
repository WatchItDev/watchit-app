// types.ts
import React from 'react';
import { Web3Auth } from '@web3auth/modal/dist/types/modalManager';
import { BundlerConfig } from '@web3auth/account-abstraction-provider/dist/types/providers/types';
import { ISmartAccount } from '@web3auth/account-abstraction-provider/dist/types/providers/smartAccounts';
import { SafeEventEmitterProvider } from '@web3auth/base/dist/types/provider/IProvider';
/**
 * Interface for profile data used in profile creation and updates.
 */
export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  profilePicture: File | string | null;
  coverPicture: File | string | null;
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
  web3Auth: Web3Auth;
  bundlerClient?: BundlerConfig
  smartAccount?: ISmartAccount
  provider?: SafeEventEmitterProvider
}

/**
 * Interface for the authentication provider props.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
