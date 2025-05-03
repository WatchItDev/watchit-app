import {LoginError} from "@lens-protocol/react-web"
import {Profile} from "@lens-protocol/api-bindings"

export interface ProfileFormInitialValuesProps {
  username: string,
  displayName: string,
  bio: string,
  profilePicture: null,
  coverPicture: null,
  socialLinks: {
    twitter: string,
    instagram: string,
    orb: string,
    farcaster: string,
  }
}

export interface ProfileFormProps {
  address: string;
  initialValues?: ProfileFormInitialValuesProps;
  mode: 'register' | 'update';
  error?: LoginError;
  onSuccess: () => void;
  onCancel: () => void;
  login?: (profile?: Profile) => Promise<void>;
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
