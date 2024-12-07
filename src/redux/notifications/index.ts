import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Notification = {
  id: string;
  text: string;
  readed: boolean;
  sender_id: string;
  category: number;
  receiver_id: string;
  created_at: string | Date;
};

type NotificationsState = {
  notifications: Notification[];
};

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
