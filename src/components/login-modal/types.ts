import {LoginError} from "@lens-protocol/react-web"
import {Profile} from "@lens-protocol/api-bindings"

export interface ProfileFormInitialValuesProps {
  username: string,
  name: string,
  bio: string,
  profileImage: null,
  backgroundImage: null,
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

export interface ProfileSelectionProps {
  address: string;
  error?: LoginError;
  onRegisterNewProfile: () => void;
  onDisconnect: () => void;
  onClose: () => void;
  login: (profile?: Profile) => Promise<void>;
}

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}


export interface ProfileFormValues {
  username: string;
  name: string;
  bio: string;
  profileImage: File | null | string;
  backgroundImage: File | null | string;
  socialLinks: {
    twitter: string;
    instagram: string;
    orb: string;
    farcaster: string;
  };
}
