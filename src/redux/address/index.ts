import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AddressReducerState = {
  address: string | null;
};

const initialState: AddressReducerState = {
  address: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    unsetAddress: (state) => {
      state.address = null;
    },
  },
});

export const { setAddress, unsetAddress } = addressSlice.actions;

export default addressSlice.reducer;
