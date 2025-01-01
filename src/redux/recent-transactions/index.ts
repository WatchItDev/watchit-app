import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionItemProps = {
  id: string;
  receiver_id: string;
  sender_id: string;
  payload: {
    amount: number;
    address: string;
    message: string;
    type: string;
    category: string;
    data: {
      to : {
        id: string;
        displayName: string;
        avatar: string;
      },
      from: {
        id: string;
        displayName: string;
        avatar: string;
      },
      content: {
        message: string;
        rawDescription: string;
      };
}
  }
}

interface TransactionsState {
  transactions: TransactionItemProps[];
}

const initialState: TransactionsState = {
  transactions: [],
};

const transactionsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<TransactionItemProps[]>) {
      state.transactions = action.payload;
    },
    appendTransaction(state, action: PayloadAction<TransactionItemProps>) {
      const existingIndex = state.transactions.findIndex(transaction => transaction.id === action.payload.id);
      if (existingIndex !== -1) {
        state.transactions[existingIndex] = action.payload;
      } else {
        // Play a sound when a new transaction is appended
        state.transactions = [action.payload, ...state.transactions];
      }
    },
  },
});

export const { setTransactions, appendTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
