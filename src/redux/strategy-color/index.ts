import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {COLORS_LIST_MARKETING} from "@src/utils/colors.ts";

interface StrategyColorState {
  color: string;
}

const initialState: StrategyColorState = {
  color: COLORS_LIST_MARKETING[0],
};

const selectedColorSlice = createSlice({
  name: 'strategyColor',
  initialState,
  reducers: {
    setSelectedStrategyColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
  },
});

export const { setSelectedStrategyColor } = selectedColorSlice.actions;
export default selectedColorSlice.reducer;
