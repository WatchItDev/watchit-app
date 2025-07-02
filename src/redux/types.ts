import { Address } from "viem"
import { User } from '@src/graphql/generated/graphql.ts';

export interface ReduxSession {
  address?: Address;
  authenticated: boolean;
  user?: User;
  info?: any;
}

export interface AuthReducerState {
  session: ReduxSession;
  isAuthLoading: boolean;
  isLoginModalOpen: boolean;
  balance: number;
}
