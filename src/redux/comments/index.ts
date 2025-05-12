import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@src/graphql/generated/graphql.ts';

export interface CommentsReducerState {
  refetchTriggerByPublication: Record<string, number>;
  hiddenComments: Comment[];
  counterLikes: Record<string, number>;
  comments: Record<string, Comment[]>;
  postCommentCount: Record<string, number>;
  commentRepliesCount: Record<string, number>;
}

const initialState: CommentsReducerState = {
  refetchTriggerByPublication: {},
  hiddenComments: [],
  counterLikes: {},
  postCommentCount: {},
  commentRepliesCount: {},
  comments: {},
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setPostCommentCount: (state, action: PayloadAction<{ postId: string; count: number }>) => {
      state.postCommentCount[action.payload.postId] = action.payload.count;
    },
    setRepliesCount: (state, action: PayloadAction<{ commentId: string; count: number }>) => {
      state.commentRepliesCount[action.payload.commentId] = action.payload.count;
    },
    incrementPostCommentCount: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.postCommentCount[id] = (state.postCommentCount[id] ?? 0) + 1;
    },
    decrementPostCommentCount: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.postCommentCount[id] = Math.max(0, (state.postCommentCount[id] ?? 1) - 1);
    },
    incrementRepliesCount: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.commentRepliesCount[id] = (state.commentRepliesCount[id] ?? 0) + 1;
    },
    decrementRepliesCount: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.commentRepliesCount[id] = Math.max(0, (state.commentRepliesCount[id] ?? 1) - 1,);
    },
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
  setPostCommentCount,
  setRepliesCount,
  incrementPostCommentCount,
  decrementPostCommentCount,
  incrementRepliesCount,
  decrementRepliesCount,
  hiddeComment,
  refetchCommentsByPublication,
  setCounterLikes,
  incrementCounterLikes,
  decrementCounterLikes,
} = commentsSlice.actions;

export default commentsSlice.reducer;
