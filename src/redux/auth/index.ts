import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {AuthReducerState, ReduxSession} from '../types'

const initialState: AuthReducerState = {
  session: null,
  isSessionLoading: false,
  isLoginModalOpen: false,
  balance: 0,
  currentStep: 0,
  isUpdatingMetadata: false,
  email: '',
  isFullyAuthenticated: false,
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
    setSession: (state, action: PayloadAction<{ session: ReduxSession }>) => {
      state.session = action.payload.session;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateProfileData: (
      state,
      action: PayloadAction<{
        name: string;
        bio: string;
        profileImage?: string;
        backgroundImage?: string;
      }>
    ) => {
      if (state.session && state.session.profile) {
        state.session.profile.metadata = {
          ...state.session.profile.metadata,
          displayName: action.payload.name,
          bio: action.payload.bio,
          picture: {
            optimized: {
              uri: action.payload.profileImage ? action.payload.profileImage : undefined,
            },
          },
          coverPicture: {
            optimized: {
              uri: action.payload.backgroundImage ? action.payload.backgroundImage : undefined,
            },
          },
        };
      }
    },
    setIsUpdatingMetadata: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingMetadata = action.payload;
    },
    setFullyAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isFullyAuthenticated = action.payload;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  setAuthLoading,
  setBalance,
  setProfileCreationStep,
  resetCurrentStep,
  setSession,
  updateProfileData,
  setIsUpdatingMetadata,
  setEmail,
  setFullyAuthenticated
} = authSlice.actions;

export default authSlice.reducer;
