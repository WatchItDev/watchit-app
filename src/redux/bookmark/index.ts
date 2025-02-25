import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AnyPublication} from "@lens-protocol/api-bindings";

export interface BookmarkReducerState {
  bookmarkPublications: AnyPublication[];
  hiddenBookmarks: AnyPublication[];
}

const initialState: BookmarkReducerState = {
  bookmarkPublications: [],
  hiddenBookmarks: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    // Add a post to bookmarks and remove it from hidden if it is
    addBookmark: (state, action: PayloadAction<AnyPublication>) => {
      const isAlreadyBookmarked = state.bookmarkPublications.some(
        (publication) => publication.id === action.payload.id,
      );

      if (!isAlreadyBookmarked) {
        state.bookmarkPublications.push(action.payload);
        // Remove from hiddenBookmarks if exists
        state.hiddenBookmarks = state.hiddenBookmarks.filter(
          (publication) => publication.id !== action.payload.id,
        );
      }
    },

    // Move a post to hiddenBookmarks instead of deleting it completely
    removeBookmark: (state, action: PayloadAction<string>) => {
      const publicationToHide = state.bookmarkPublications.find(
        (publication) => publication.id === action.payload,
      );

      if (publicationToHide) {
        state.hiddenBookmarks.push(publicationToHide);
        state.bookmarkPublications = state.bookmarkPublications.filter(
          (publication) => publication.id !== action.payload,
        );
      }
    },
  },
});

export const {addBookmark, removeBookmark} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
