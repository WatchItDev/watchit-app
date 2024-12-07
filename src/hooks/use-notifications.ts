import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@src/utils/supabase';
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { ProfileSession, useSession } from '@lens-protocol/react-web';
import { NotificationColumnsProps } from '@src/layouts/_common/notifications-popover/notification-item.tsx';
import { setNotifications } from '@src/redux/notifications';

type UseNotificationsReturn = {
  getNotifications: (id: string) => Promise<void>;
  subscribeToNotifications: () => void;
  notifications: NotificationColumnsProps[];
  markAsRead: (id: string) => Promise<void>;
  sendNotification: (receiver_id: string, sender_id: string, text: string, category: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export function useNotifications(): UseNotificationsReturn {
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  useEffect(() => {
    if (sessionData?.profile?.id) {
      getNotifications(sessionData.profile.id);
      subscribeToNotifications();
    }
  }, [sessionData?.profile?.id]);

  async function getNotifications(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('readed', false)
      .eq('receiver_id', id);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      dispatch(setNotifications(data as NotificationColumnsProps[]));
    }
  }

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ readed: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      getNotifications(sessionData?.profile?.id);
    }
  }

  async function sendNotification(receiver_id: string, sender_id: string, text: string, category: number) {
    const { error, data } = await supabase
      .from('notifications')
      .insert([{ receiver_id, sender_id, text, category }]);

    if (error) {
      console.error('Error sending notification:', error);
    } else {
      getNotifications(receiver_id);
    }
  }

  async function markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ readed: true })
      .eq('receiver_id', sessionData?.profile?.id);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      getNotifications(sessionData?.profile?.id);
    }
  }

  function subscribeToNotifications( ) {
    supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        const notification = payload.new;
        if (!notification.readed) {
          dispatch(setNotifications([...notifications, notification]));
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, payload => {
        const updatedNotification = payload.new;
        dispatch(setNotifications(notifications.map(notification =>
          notification.id === updatedNotification.id ? updatedNotification : notification
        )));
      })
      .subscribe();
  }

  return {
    getNotifications,
    subscribeToNotifications,
    notifications,
    markAsRead,
    sendNotification,
    markAllAsRead,
  };
}
