import { Address } from 'viem';
import { AppUser } from '@src/types/app-user.ts';
import { UserInfo } from '@web3auth/base';

export interface ReduxSession {
  address?: Address;
  authenticated: boolean;
  user?: AppUser;
  info?: Partial<UserInfo>;
}

export interface AuthReducerState {
  session: ReduxSession;
  isAuthLoading: boolean;
  isLoginModalOpen: boolean;
}
