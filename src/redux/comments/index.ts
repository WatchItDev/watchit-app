import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyPublication } from '@lens-protocol/api-bindings';

export type CommentsReducerState = {
  hiddenComments: AnyPublication[];
};

const initialState: CommentsReducerState = {
  hiddenComments: [],
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    hiddeComment: (state, action: PayloadAction<AnyPublication>) => {
        state.hiddenComments.push(action.payload);
    },
  },
});

export const { hiddeComment } = commentsSlice.actions;

export default commentsSlice.reducer;
