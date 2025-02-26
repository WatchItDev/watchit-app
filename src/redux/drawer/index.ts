import {createSlice} from "@reduxjs/toolkit";

export const drawerInitialState = {
  open: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState: drawerInitialState,
  reducers: {
    openDrawer: (state) => {
      state.open = true;
    },
    closeDrawer: (state) => {
      state.open = false;
    },
    toggleDrawer: (state) => {
      state.open = !state.open;
    },
  },
});

export const {openDrawer, closeDrawer, toggleDrawer} = drawerSlice.actions;

export default drawerSlice.reducer;
