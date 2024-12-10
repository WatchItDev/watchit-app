import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationColumnsProps } from '@src/layouts/_common/notifications-popover/notification-item.tsx';

interface NotificationsState {
  notifications: NotificationColumnsProps[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationColumnsProps[]>) {
      state.notifications = action.payload;
    },
    appendNotification(state, action: PayloadAction<NotificationColumnsProps>) {
      const existingIndex = state.notifications.findIndex(notification => notification.id === action.payload.id);
      if (existingIndex !== -1) {
        state.notifications[existingIndex] = action.payload;
      } else {
        state.notifications = [action.payload, ...state.notifications];
      }
    },
  },
});

export const { setNotifications, appendNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
