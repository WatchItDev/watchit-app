import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@src/utils/supabase';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { NotificationColumnsProps } from '@src/layouts/_common/notifications-popover/notification-item.tsx';
import { setNotifications } from '@src/redux/notifications';

type UseNotificationsReturn = {
  getNotifications: (id: string) => Promise<void>;
  notifications: NotificationColumnsProps[];
  markAsRead: (id: string) => Promise<void>;
  sendNotification: (receiver_id: string, sender_id: string, text: string, category: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export function useNotifications(): UseNotificationsReturn {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const dispatch = useDispatch();
  // @ts-ignore
  const notifications: NotificationColumnsProps[] = useSelector((state) => state.notifications.notifications);

  async function getNotifications(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', id);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      dispatch(setNotifications(data as NotificationColumnsProps[]));
    }
  }

  async function markAsRead(id: string) {
    const { error, data } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    console.log('markAsRead', data);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      const updatedNotifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      dispatch(setNotifications(updatedNotifications));
    }
  }

  async function sendNotification(receiver_id: string, sender_id: string, payload: any) {
    const { error } = await supabase
      .from('notifications')
      .insert([{ receiver_id, sender_id, payload}]);

    if (error) {
      console.error('Error sending notification:', error);
    }
  }

  async function markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('receiver_id', sessionData?.profile?.id);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
      dispatch(setNotifications(updatedNotifications));
    }
  }

  return {
    getNotifications,
    notifications,
    markAsRead,
    sendNotification,
    markAllAsRead,
  };
}
