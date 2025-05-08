import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@src/graphql/generated/graphql.ts';

export interface CommentsReducerState {
  refetchTriggerByPublication: Record<string, number>;
  hiddenComments: Comment[];
  counterLikes: Record<string, number>;
  comments: Record<string, Comment[]>;
}

const initialState: CommentsReducerState = {
  refetchTriggerByPublication: {},
  hiddenComments: [],
  counterLikes: {},
  comments: {},
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    refetchCommentsByPublication: (state, action: PayloadAction<string>) => {
      const publicationId = action.payload;
      if (!state.refetchTriggerByPublication[publicationId]) {
        state.refetchTriggerByPublication[publicationId] = 1;
      } else {
        state.refetchTriggerByPublication[publicationId] += 1;
      }
    },
    hiddeComment: (state, action: PayloadAction<Comment>) => {
      state.hiddenComments.push(action.payload);
    },
    setCounterLikes: (state, action: PayloadAction<{ publicationId: string; likes: number }>) => {
      state.counterLikes[action.payload.publicationId] = action.payload.likes;
    },
    incrementCounterLikes: (state, action: PayloadAction<string>) => {
      const publicationId = action.payload;
      if (state.counterLikes[publicationId] !== undefined) {
        state.counterLikes[publicationId] += 1;
      }
    },
    decrementCounterLikes: (state, action: PayloadAction<string>) => {
      const publicationId = action.payload;
      if (state.counterLikes[publicationId] !== undefined) {
        state.counterLikes[publicationId] -= 1;
      }
    },
  },
});

export const {
  hiddeComment,
  refetchCommentsByPublication,
  setCounterLikes,
  incrementCounterLikes,
  decrementCounterLikes,
} = commentsSlice.actions;

export default commentsSlice.reducer;
