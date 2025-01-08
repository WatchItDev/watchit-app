import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyPublication } from '@lens-protocol/api-bindings';

type PendingComment = AnyPublication & { uri: string };

export type CommentsReducerState = {
  refetchTriggerByPublication: {
    [publicationId: string]: number;
  };
  hiddenComments: AnyPublication[];
  counterLikes: { [publicationId: string]: number };
  comments: { [publicationId: string]: AnyPublication[] };
  pendingComments: { [publicationId: string]: PendingComment[] };
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
    addPendingComment: (
      state,
      action: PayloadAction<{ publicationId: string; comment: PendingComment }>
    ) => {
      const { publicationId, comment } = action.payload;
      if (!state.pendingComments[publicationId]) {
        state.pendingComments[publicationId] = [];
      }
      // Prepend new comment to the beginning of the list
      state.pendingComments[publicationId] = [comment, ...state.pendingComments[publicationId]];
    },
    removePendingComment: (
      state,
      action: PayloadAction<{ publicationId: string; commentId: string }>
    ) => {
      const { publicationId, commentId } = action.payload;

      // Delete the comment from the pending list
      state.pendingComments[publicationId] = state.pendingComments[publicationId].filter(
        (comment) => comment.id !== commentId
      );
    },
  },
});

export const {
  hiddeComment,
  refetchCommentsByPublication,
  setCounterLikes,
  incrementCounterLikes,
  decrementCounterLikes,
  addPendingComment,
  removePendingComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;
