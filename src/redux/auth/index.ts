import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthReducerState = {
  isLoginModalOpen: boolean,
  isAuthLoading: boolean,
  balance: number,
}

const initialState : AuthReducerState = {
  isLoginModalOpen: false,
  isAuthLoading: false,
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
  },
});

export const { openLoginModal, closeLoginModal, setAuthLoading, setBalance } = authSlice.actions;

export default authSlice.reducer;
