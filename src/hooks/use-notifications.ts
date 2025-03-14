import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@src/utils/supabase';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { type NotificationColumnsProps } from '@src/hooks/types';
import { setNotifications } from '@src/redux/notifications';
import {RootState} from "@redux/store.ts"

interface UseNotificationsReturn {
  getNotifications: (id: string) => Promise<void>;
  notifications: NotificationColumnsProps[];
  markAsRead: (id: string) => Promise<void>;
  sendNotification: (receiver_id: string, sender_id: string, payload: any) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const dispatch = useDispatch();
  // @ts-ignore
  const notifications: NotificationColumnsProps[] = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  async function getNotifications(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('receiver_id', id);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      dispatch(setNotifications(data as NotificationColumnsProps[]));
    }
  }

  async function markAsRead(id: string) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      dispatch(setNotifications(updatedNotifications));
    }
  }

  async function sendNotification(receiver_id: string, sender_id: string, payload: any) {
    const { error } = await supabase
      .from('notifications')
      .insert([{ receiver_id, sender_id, payload }]);

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
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      dispatch(setNotifications(updatedNotifications));
    }
  }

  // async deleteNotification(id: string)
  async function deleteNotification(id: string) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      const updatedNotifications = notifications.filter((notification) => notification.id !== id);
      dispatch(setNotifications(updatedNotifications));
    }
  }

  return {
    getNotifications,
    notifications,
    markAllAsRead,
    markAsRead,
    sendNotification,
    deleteNotification,
  };
}
