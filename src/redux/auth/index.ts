import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {AuthReducerState, ReduxSession} from '../types'
import { User } from '@src/graphql/generated/graphql.ts';

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
    setInfo: (state, action: PayloadAction<any>) => {
      state.session.info = action.payload.info;
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
  setInfo
} = authSlice.actions;

export default authSlice.reducer;
