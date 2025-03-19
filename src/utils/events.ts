import { Dispatch } from 'redux';
import { appendNotification } from '@src/redux/notifications';
import { NotificationColumnsProps, NotificationItemProps } from '@src/hooks/types';


interface NotificationPayload {
  new: NotificationColumnsProps;

  [key: string]: unknown;
}

// Define the event handler type
type EventHandler = (payload: NotificationPayload, profileId: string, dispatch?: Dispatch) => void;

/**
 * Handle notification event for internal popover.
 * @param payload Data from the event (set as needed)
 * @param profileId Current user profile id for LENS Protocol
 * @param dispatch Redux dispatch function
 */
export const handleNotification: EventHandler = (payload, profileId, dispatch) => {
  const notification = payload.new;

  if (notification?.receiver_id === profileId) {
    if (dispatch) {
      // Create a notification item that matches NotificationItemProps
      const notificationItem: NotificationItemProps = {
        id: notification.id,
        notification: notification,
        // This is a placeholder function since the actual implementation
        // will be provided by the component that uses this notification
        onMarkAsRead: (id: string) => {
          // The actual implementation is handled by the UI component
          console.log(`Mark as read will be handled by UI for notification: ${id}`);
        }
      };
      
      dispatch(appendNotification(notificationItem));
    }
  }
};

export const eventsHandlersMap = {
  NOTIFICATION: handleNotification,
};

/**
 * Main handler that delegates to the appropriate event handler based on the event type
 */
export const handleEvents = (payload: NotificationPayload, profileId: string, dispatch?: Dispatch) => {
  const eventType: keyof typeof eventsHandlersMap = payload?.new?.payload?.type;

  if (eventsHandlersMap[eventType]) {
    eventsHandlersMap[eventType](payload, profileId, dispatch);
  }
};
