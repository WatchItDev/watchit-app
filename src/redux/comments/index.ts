import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyPublication } from '@lens-protocol/api-bindings';

export type CommentsReducerState = {
  refetchTriggerByPublication: {
    [publicationId: string]: number;
  };
  hiddenComments: AnyPublication[];
  counterLikes: { [publicationId: string]: number };
  comments: { [publicationId: string]: AnyPublication[] };
  pendingComments: { [publicationId: string]: AnyPublication[] };
};

const initialState: CommentsReducerState = {
  refetchTriggerByPublication: {},
  hiddenComments: [],
  counterLikes: {},
  comments: {},
  pendingComments: {},
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
    hiddeComment: (state, action: PayloadAction<AnyPublication>) => {
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
    addComment: (state, action: PayloadAction<{ publicationId: string; comment: AnyPublication }>) => {
      const { publicationId, comment } = action.payload;
      if (!state.comments[publicationId]) {
        state.comments[publicationId] = [];
      }
      state.comments[publicationId].push(comment);
    },
    addPendingComment: (state, action: PayloadAction<{ publicationId: string; comment: AnyPublication }>) => {
      const { publicationId, comment } = action.payload;
      if (!state.pendingComments[publicationId]) {
        state.pendingComments[publicationId] = [];
      }
      // Prepend new comment to the beginning of the list
      state.pendingComments[publicationId] = [comment, ...state.pendingComments[publicationId]];
    },
    updateCommentStatus: (state, action: PayloadAction<{ publicationId: string; commentId: string; status: string }>) => {
      const { publicationId, commentId, status } = action.payload;
      const comment = state.comments[publicationId]?.find(comment => comment.id === commentId);
      state.comments[publicationId] = state.comments[publicationId].filter(comment => comment.id !== commentId);

    },
  },
});

export const {
  hiddeComment,
  refetchCommentsByPublication,
  setCounterLikes,
  incrementCounterLikes,
  decrementCounterLikes,
  addComment,
  addPendingComment,
  updateCommentStatus,
} = commentsSlice.actions;

export default commentsSlice.reducer;
