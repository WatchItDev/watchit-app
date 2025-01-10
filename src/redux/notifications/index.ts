import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItemProps } from '@src/layouts/_common/notifications-popover/notification-item.tsx';

// @ts-ignore
import Ding from '@src/assets/audio/notify.mp3';

interface NotificationsState {
  notifications: NotificationItemProps[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItemProps[]>) {
      state.notifications = action.payload;
    },
    appendNotification(state, action: PayloadAction<NotificationItemProps>) {
      const existingIndex = state.notifications.findIndex(
        (notification) => notification.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.notifications[existingIndex] = action.payload;
      } else {
        // Play a sound when a new notification is appended
        const audio = new Audio(Ding);
        audio.play();
        state.notifications = [action.payload, ...state.notifications];
      }
    },
  },
});

export const { setNotifications, appendNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
