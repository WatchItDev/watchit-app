import {Address} from "viem"
import {Profile} from "@lens-protocol/api-bindings"

export interface ReduxSession {
  address: Address;
  authenticated: boolean;
  profile: Profile;
  type: string
}

export interface AuthReducerState {
  session: ReduxSession | null;
  isSessionLoading: boolean;
  isLoginModalOpen: boolean;
  balance: number;
  currentStep: number;
  isUpdatingMetadata: boolean;
  email: string;
  isFullyAuthenticated: boolean;
}
