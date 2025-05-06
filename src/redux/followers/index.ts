import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@src/graphql/generated/graphql.ts';

interface FollowersState {
  followers: User[];
  followings: User[];
}

const initialState: FollowersState = {
  followers: [],
  followings: [],
};

const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<User[]>) => {
      state.followers = action.payload;
    },
    setFollowings: (state, action: PayloadAction<User[]>) => {
      state.followings = action.payload;
    },

    addFollowing: (state, action: PayloadAction<User>) => {
      state.followings.push(action.payload);
    },

    removeFollowing: (state, action: PayloadAction<string>) => {
      state.followings = state.followings.filter((following) => following.address !== action.payload);
    },

    addFollower: (state, action: PayloadAction<User>) => {
      state.followers.push(action.payload);
    },

    removeFollower: (state, action: PayloadAction<string>) => {
      state.followers = state.followers.filter((follower) => follower.address !== action.payload);
    },
  },
});

export const { setFollowers, setFollowings, removeFollowing, addFollowing, addFollower, removeFollower } =
  followersSlice.actions;

export default followersSlice.reducer;
