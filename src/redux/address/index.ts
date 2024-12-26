import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddressState {
  address: string;
  profileId: string;
  showRainbow: boolean;
}

const initialState: AddressState = {
  address: '',
  profileId: '',
  showRainbow: false,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    storeAddress(state, action: PayloadAction<{ address: string; profileId: string }>) {
      state.address = action.payload.address;
      state.profileId = action.payload.profileId;
    },

    toggleRainbow(state) {
      state.showRainbow = !state.showRainbow;
    },

  },
});

export const { storeAddress, toggleRainbow } = addressSlice.actions;
export default addressSlice.reducer;
