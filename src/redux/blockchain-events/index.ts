import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Log } from 'viem'

interface BlockchainEventsState {
  events: Log[];
}

const initialState: BlockchainEventsState = {
  events: [],
}

const blockchainEventsSlice = createSlice({
  name: 'blockchainEvents',
  initialState,
  reducers: {
    addBlockchainEvent(state, action: PayloadAction<Log>) {
      state.events.push(action.payload)
    },
    setBlockchainEvents(state, action: PayloadAction<Log[]>) {
      state.events = action.payload
    },
    clearBlockchainEvents(state) {
      state.events = []
    },
  },
})

export const { addBlockchainEvent, setBlockchainEvents, clearBlockchainEvents } =
  blockchainEventsSlice.actions

export default blockchainEventsSlice.reducer
