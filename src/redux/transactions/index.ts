import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a transaction log
export interface TransactionLog {
  address: string;
  args: {
    amount: bigint;
    currency: string;
    recipient: string;
    sender: string;
  };
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: string;
  eventName: string;
  formattedAmount: string;
  logIndex: number;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

// Define the initial state
interface TransactionsState {
  transactions: TransactionLog[];
}

const initialState: TransactionsState = {
  transactions: [],
};

// Create the slice
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Action to set all transactions (e.g., from history)
    setTransactions: (state, action: PayloadAction<TransactionLog[]>) => {
      state.transactions = action.payload;
    },
    // Action to add a new transaction in real-time
    addTransaction: (state, action: PayloadAction<TransactionLog>) => {
      // Avoid duplicates based on transactionHash
      const exists = state.transactions.find(
        (tx) => tx.transactionHash === action.payload.transactionHash,
      );
      if (!exists) {
        state.transactions.unshift(action.payload); // Add to the beginning to maintain order
      }
    },
  },
});

export const { setTransactions, addTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
