import { AppUser } from '@src/types/app-user.ts';

export interface ProfileFormInitialValuesProps {
  username: string;
  displayName: string;
  bio: string;
  profilePicture: string | null;
  coverPicture: string | null;
  socialLinks: {
    twitter: string;
    instagram: string;
    orb: string;
    farcaster: string;
  };
}

export interface ProfileFormProps {
  initialValues?: ProfileFormInitialValuesProps;
  mode: 'register' | 'update';
  error?: Error;
  onSuccess: () => void;
  onCancel: () => void;
  login?: (profile?: AppUser) => Promise<void>;
}

export interface ProfileFormValues {
  username: string;
  displayName: string;
  bio: string;
  profilePicture: File | null | string;
  coverPicture: File | null | string;
  socialLinks: {
    twitter: string;
    instagram: string;
    orb: string;
    farcaster: string;
  };
}
