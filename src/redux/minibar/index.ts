import { createSlice } from '@reduxjs/toolkit';

export type StateType = 'mini' | 'vertical';

const initialState = {
  state: 'vertical' as StateType,
  wasCollapsed: false,
};

const minibarSlice = createSlice({
  name: 'minibar',
  initialState,
  reducers: {
    toggleMinibar: (state) => {
      state.state = state.state === 'mini' ? 'vertical' : 'mini';
    },

    removeMinibar: (state) => {
      state.state = 'vertical';
    },

    openMinibar: (state) => {
      state.state = 'mini';
    },

    setCollapsed: (state, action) => {
      state.wasCollapsed = action.payload;
    },
  },
});

export const { toggleMinibar, removeMinibar, openMinibar, setCollapsed } = minibarSlice.actions;

export default minibarSlice.reducer;
