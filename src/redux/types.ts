import { Address } from "viem"
import { User } from '@src/graphql/generated/graphql.ts';
import { UserInfo } from '@web3auth/base';

export interface ReduxSession {
  address?: Address;
  authenticated: boolean;
  user?: User;
  info?: Partial<UserInfo>;
}

export interface AuthReducerState {
  session: ReduxSession;
  isAuthLoading: boolean;
  isLoginModalOpen: boolean;
}
