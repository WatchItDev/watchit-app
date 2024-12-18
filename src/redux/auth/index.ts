import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthReducerState = {
  session: any;
  isSessionLoading: boolean;
  isLoginModalOpen: boolean;
  balance: number;
  currentStep: number;
  isUpdatingMetadata: boolean;
};

const initialState: AuthReducerState = {
  session: null,
  isSessionLoading: false,
  isLoginModalOpen: false,
  balance: 0,
  currentStep: 0,
  isUpdatingMetadata: false,
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
    updateProfileData: (
      state,
      action: PayloadAction<{
        name: string;
        bio: string;
        profileImage: string;
        backgroundImage: string;
        socialLinks: {
          twitter: string;
          instagram: string;
          orb: string;
          farcaster: string;
        };
      }>
    ) => {
      console.log('updateProfileData', state.session);
      if (state.session && state.session.profile) {
        console.log('updateProfileData', state.session.profile.metadata);
        state.session.profile.metadata = {
          ...state.session.profile.metadata,
          displayName: action.payload.name,
          bio: action.payload.bio,
          picture: { optimized: { uri: !!action.payload.backgroundImage ? action.payload.backgroundImage : undefined } },
          coverPicture: { optimized: { uri: !!action.payload.backgroundImage ? action.payload.backgroundImage : undefined } },
          attributes: [
            { key: 'twitter', value: action.payload.socialLinks.twitter },
            { key: 'instagram', value: action.payload.socialLinks.instagram },
            { key: 'orb', value: action.payload.socialLinks.orb },
            { key: 'farcaster', value: action.payload.socialLinks.farcaster },
          ],
        };
        console.log('updateProfileData 2', state.session.profile.metadata);
      }
    },

    setIsUpdatingMetadata: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingMetadata = action.payload;
    }
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
} = authSlice.actions;

export default authSlice.reducer;
