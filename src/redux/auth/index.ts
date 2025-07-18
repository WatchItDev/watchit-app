import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {AuthReducerState, ReduxSession} from '../types'
import { User } from '@src/graphql/generated/graphql.ts';
import { UserInfo } from '@web3auth/base';

export const defaultSession = {
  address: undefined,
  authenticated: false,
  user: undefined,
  info: undefined,
}

const initialState: AuthReducerState = {
  session: defaultSession,
  isAuthLoading: false,
  isLoginModalOpen: false,
  balance: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    setAuthLoading: (state, action: PayloadAction<Pick<AuthReducerState, 'isAuthLoading'>>) => {
      state.isAuthLoading = action.payload.isAuthLoading;
    },
    setBalance: (state, action: PayloadAction<Pick<AuthReducerState, 'balance'>>) => {
      state.balance = action.payload.balance;
    },
    setSession: (state, action: PayloadAction<{ session: ReduxSession }>) => {
      state.session = action.payload.session;
    },
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.session.user = action.payload.user;
    },
    setInfo: (state, action: PayloadAction<{ info: Partial<UserInfo> }>) => {
      state.session.info = action.payload.info;
    },
    incrementXp: (state, action: PayloadAction<{ amount: number }>) => {
      const user = state.session.user;
      if (user) {
        user.xpBalance += action.payload.amount;
        user.xpTotal   += action.payload.amount;
      }
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  setAuthLoading,
  setBalance,
  setSession,
  setUser,
  incrementXp,
  setInfo
} = authSlice.actions;

export default authSlice.reducer;
