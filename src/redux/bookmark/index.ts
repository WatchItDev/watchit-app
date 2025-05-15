import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@src/graphql/generated/graphql.ts';

export interface BookmarkReducerState {
  bookmarkPublications: Post[];
  hiddenBookmarks: Post[];
}

const initialState: BookmarkReducerState = {
  bookmarkPublications: [],
  hiddenBookmarks: [],
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    // Add a post to bookmarks and remove it from hidden if it is
    addBookmark: (state, action: PayloadAction<Post>) => {
      const isAlreadyBookmarked = state.bookmarkPublications.some(
        (publication) => publication.id === action.payload.id
      );

      if (!isAlreadyBookmarked) {
        state.bookmarkPublications.push(action.payload);
        // Remove from hiddenBookmarks if exists
        state.hiddenBookmarks = state.hiddenBookmarks.filter(
          (publication) => publication.id !== action.payload.id
        );
      }
    },

    // Move a post to hiddenBookmarks instead of deleting it completely
    removeBookmark: (state, action: PayloadAction<string>) => {
      const publicationToHide = state.bookmarkPublications.find(
        (publication) => publication.id === action.payload
      );

      if (publicationToHide) {
        state.hiddenBookmarks.push(publicationToHide);
        state.bookmarkPublications = state.bookmarkPublications.filter(
          (publication) => publication.id !== action.payload
        );
      }
    },

    // Remove all bookmarks
    clearBookmarks: (state) => {
      state.bookmarkPublications = [];
    },
  },
});

export const { addBookmark, removeBookmark, clearBookmarks } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
