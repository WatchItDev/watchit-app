import { Dispatch } from "redux";
import { appendNotification } from '@src/redux/notifications';

/* Notification payload required items
{
    "type" : NOTIFICATION|BALANCE|OTHER|ETC,
    "data" : {
      "from": "0x05d0", // The same for sender_id
      "to": "0x05a0" // The same for receiver_id
      "description": "Any text"
      .... // Any other data as needed
    }
}
*/
export namespace Events {
  export const Handlers = (payload: any, profileId: string, dispatch?: Dispatch) => {
    const evenType: keyof typeof EventsHandlersMap = payload?.new?.payload?.type;

    if (EventsHandlersMap[evenType]) {
      EventsHandlersMap[evenType](payload, profileId, dispatch);
    }
  };

  /**
   * Handle notification event for internal popover.
   * @param payload Data from the event (set as needed)
   * @param profileId Current user profile id for LENS Protocol
   * @param dispatch Redux dispatch function
   * @constructor
   */
  export const Notification = (payload: any, profileId: string, dispatch?: Dispatch) => {
    const notification = payload.new;

    if (notification?.receiver_id === profileId) {
      if (dispatch) {
        dispatch(appendNotification(notification));
      }
    }
  };
  // @TODO: Add more event handlers when needed
  // @ts-ignore
  export const Transaction = (payload: any) => {};
  // @ts-ignore
  export const Publication = (payload: any) => {};
  // @ts-ignore
  export const Subscription = (payload: any) => {};
  // @ts-ignore
  export const Follower = (payload: any) => {};
}

export const EventsHandlersMap = {
  NOTIFICATION: Events.Notification,
  TRANSACTION: Events.Transaction,
  PUBLICATION: Events.Publication,
  SUBSCRIPTION: Events.Subscription,
  FOLLOWER: Events.Follower,
};
