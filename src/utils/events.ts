import { Dispatch } from 'redux';
import { appendNotification } from '@src/redux/notifications';

/**
 * Handle notification event for internal popover.
 * @param payload Data from the event (set as needed)
 * @param profileId Current user profile id for LENS Protocol
 * @param dispatch Redux dispatch function
 */
export const handleNotification = (payload: any, profileId: string, dispatch?: Dispatch) => {
  const notification = payload.new;

  if (notification?.receiver_id === profileId) {
    if (dispatch) {
      dispatch(appendNotification(notification));
    }
  }
};


export const eventsHandlersMap = {
  NOTIFICATION: handleNotification,
};

/**
 * Main hand
ler that delegates to the appropriate event handler based on the event type
 */
export const handleEvents = (payload: any, profileId: string, dispatch?: Dispatch) => {
  const eventType: keyof typeof eventsHandlersMap = payload?.new?.payload?.type;

  if (eventsHandlersMap[eventType]) {
    eventsHandlersMap[eventType](payload, profileId, dispatch);
  }
};
