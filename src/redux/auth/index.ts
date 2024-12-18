import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthReducerState = {
  session: any;
  isSessionLoading: boolean;
  isLoginModalOpen: boolean;
  balance: number;
  currentStep: number;
};

const initialState: AuthReducerState = {
  session: null,
  isSessionLoading: false,
  isLoginModalOpen: false,
  balance: 0,
  currentStep: 0
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

    setAuthLoading: (state, action: PayloadAction<Pick<AuthReducerState, 'isSessionLoading'>>) => {
      state.isSessionLoading = action.payload.isSessionLoading;
    },
    setBalance: (state, action: PayloadAction<Pick<AuthReducerState, 'balance'>>) => {
      state.balance = action.payload.balance;
    },

    setProfileCreationStep: (state, action: PayloadAction<{ step: number }>) => {
      state.currentStep = action.payload.step;
    },
    resetCurrentStep: (state) => {
      state.currentStep = 0;
    },

    setSession: (state, action: PayloadAction<{ session: any }>) => {
      state.session = action.payload.session;
    },
  },
});

export const { openLoginModal, closeLoginModal, setAuthLoading, setBalance, setProfileCreationStep, resetCurrentStep, setSession } = authSlice.actions;

export default authSlice.reducer;
