import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthReducerState, ReduxSession } from '../types';
import { User } from '@src/graphql/generated/graphql.ts';
import { UserInfo } from '@web3auth/base';

export const defaultSession = {
  address: undefined,
  authenticated: false,
  user: undefined,
  info: undefined,
};

const initialState: AuthReducerState = {
  session: defaultSession,
  isAuthLoading: false,
  isLoginModalOpen: false,
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
    setAuthLoading: (
      state,
      action: PayloadAction<Pick<AuthReducerState, 'isAuthLoading'>>,
    ) => {
      state.isAuthLoading = action.payload.isAuthLoading;
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
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  setAuthLoading,
  setSession,
  setUser,
  setInfo,
} = authSlice.actions;

export default authSlice.reducer;
