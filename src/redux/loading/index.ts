import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ExploreLoadingState {
  top: boolean;
  creators: boolean;
  posts: boolean;
}

export interface LoadingState {
  explore: ExploreLoadingState;
}

const initialState: LoadingState = {
  explore: {
    top: true,
    posts: true,
    creators: true,
  },
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setExploreLoading(state, action: PayloadAction<{ key: keyof ExploreLoadingState; isLoading: boolean }>) {
      state.explore[action.payload.key] = action.payload.isLoading;
    },

    // Generic action to set loading state for any section and key
    setLoading(
      state,
      action: PayloadAction<{
        section: keyof LoadingState;
        key: string;
        isLoading: boolean;
      }>
    ) {
      const { section, key, isLoading } = action.payload;
      // @ts-expect-error-error - Dynamic access
      state[section][key] = isLoading;
    },
  },
});

export const { setExploreLoading, setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
