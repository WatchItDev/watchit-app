import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Profile} from "@lens-protocol/api-bindings";

interface FollowersState {
  followers: Profile[];
  followings: Profile[];
}

export const followersInitialState: FollowersState = {
  followers: [],
  followings: [],
};

const followersSlice = createSlice({
  name: "followers",
  initialState: followersInitialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<Profile[]>) => {
      state.followers = action.payload;
    },
    setFollowings: (state, action: PayloadAction<Profile[]>) => {
      state.followings = action.payload;
    },

    addFollowing: (state, action: PayloadAction<Profile>) => {
      state.followings.push(action.payload);
    },

    removeFollowing: (state, action: PayloadAction<string>) => {
      state.followings = state.followings.filter((following) => following.id !== action.payload);
    },
  },
});

export const {setFollowers, setFollowings, removeFollowing, addFollowing} = followersSlice.actions;

export default followersSlice.reducer;
