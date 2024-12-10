import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyPublication } from '@lens-protocol/api-bindings';

export type CommentsReducerState = {
  refetchTriggerByPublication: {
    [publicationId: string]: number;
  };
  hiddenComments: AnyPublication[];
};

const initialState: CommentsReducerState = {
  refetchTriggerByPublication: {},
  hiddenComments: [],
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
  },
});

export const { hiddeComment, refetchCommentsByPublication } = commentsSlice.actions;

export default commentsSlice.reducer;
