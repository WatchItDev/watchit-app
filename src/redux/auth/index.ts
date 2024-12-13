// src/redux/auth/index.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthReducerState = {
  isLoginModalOpen: boolean;
  isAuthLoading: boolean;
  balance: number;
  modalCreationProfile: boolean;
  profileCreationSteps: {
    step1: 'idle' | 'running' | 'finished';
    step2: 'idle' | 'running' | 'finished';
    step3: 'idle' | 'running' | 'finished';
  };
};

const initialState: AuthReducerState = {
  isLoginModalOpen: false,
  isAuthLoading: false,
  balance: 0,
  modalCreationProfile: false,
  profileCreationSteps: {
    step1: 'idle',
    step2: 'idle',
    step3: 'idle',
  },
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
    toggleModalCreationProfile: (state) => {
      state.modalCreationProfile = !state.modalCreationProfile;
      // IF the modal is closed, reset the steps
      if (!state.modalCreationProfile) {
        state.profileCreationSteps.step1 = 'idle';
        state.profileCreationSteps.step2 = 'idle';
        state.profileCreationSteps.step3 = 'idle';
      }
    },
    setProfileCreationStep: (state, action: PayloadAction<{ step: number; status: 'idle' | 'running' | 'finished' }>) => {
      const { step, status } = action.payload;
      // @ts-ignore
      state.profileCreationSteps[`step${step}`] = status;
    },
  },
});

export const { openLoginModal, closeLoginModal, setAuthLoading, setBalance, toggleModalCreationProfile, setProfileCreationStep } = authSlice.actions;

export default authSlice.reducer;
