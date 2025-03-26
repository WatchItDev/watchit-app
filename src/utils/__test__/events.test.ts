import { handleNotification, handleEvents, eventsHandlersMap } from '../events';
import { appendNotification } from '@src/redux/notifications';
import { NotificationCategories } from '@src/hooks/types';

vi.mock('@src/redux/notifications', () => ({
  appendNotification: vi.fn((data) => ({
    type: 'notifications/appendNotification',
    payload: data
  }))
}));

describe('[UTILS]: handleNotification', () => {
  const mockDispatch = vi.fn();
  const mockProfileId = 'profile123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches appendNotification when profileId matches receiver_id', () => {
    const mockPayload = {
      new: {
        id: 'notification123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        payload: { type: 'NOTIFICATION' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    handleNotification(mockPayload, mockProfileId, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(appendNotification(expect.objectContaining({
      id: 'notification123',
      notification: mockPayload.new,
      onMarkAsRead: expect.any(Function)
    })));
  });

  it('does not dispatch when profileId does not match receiver_id', () => {
    const mockPayload = {
      new: {
        id: 'notification123',
        receiver_id: 'different-profile',
        sender_id: 'sender123',
        payload: { type: 'NOTIFICATION' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    handleNotification(mockPayload, mockProfileId, mockDispatch);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch when dispatch is not provided', () => {
    const mockPayload = {
      new: {
        id: 'notification123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        payload: { type: 'NOTIFICATION' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    expect(() => handleNotification(mockPayload, mockProfileId)).not.toThrow();
  });

  it('creates notification item with correct onMarkAsRead function', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const mockPayload = {
      new: {
        id: 'notification123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        payload: { type: 'NOTIFICATION' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    handleNotification(mockPayload, mockProfileId, mockDispatch);

    const dispatchArg = mockDispatch.mock.calls[0][0];

    const notificationItem = dispatchArg.payload;

    notificationItem.onMarkAsRead('notification123');

    expect(consoleSpy).toHaveBeenCalledWith('Mark as read will be handled by UI for notification: notification123');
  });
});

describe('[UTILS]: handleEvents', () => {
  const mockDispatch = vi.fn();
  const mockProfileId = 'profile123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the correct handler based on event type', () => {
    const handleNotificationSpy = vi.spyOn(eventsHandlersMap, 'NOTIFICATION');

    const mockPayload = {
      new: {
        id: 'notification123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        payload: { type: 'NOTIFICATION' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    handleEvents(mockPayload, mockProfileId, mockDispatch);

    expect(handleNotificationSpy).toHaveBeenCalledTimes(1);
    expect(handleNotificationSpy).toHaveBeenCalledWith(mockPayload, mockProfileId, mockDispatch);
  });

  it('does nothing when handler for event type is not found', () => {
    const mockPayload = {
      new: {
        id: 'unknownEvent123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        payload: { type: 'UNKNOWN_EVENT_TYPE' },
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false
      }
    };

    expect(() => handleEvents(mockPayload, mockProfileId, mockDispatch)).not.toThrow();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('handles missing payload or type gracefully', () => {
    const incompletePayload = {
      new: {
        id: 'incomplete123',
        receiver_id: mockProfileId,
        sender_id: 'sender123',
        category: NotificationCategories.COMMENT,
        created_at: new Date().toISOString(),
        read: false,
        payload: {}
      }
    };

    expect(() => handleEvents(incompletePayload, mockProfileId, mockDispatch)).not.toThrow();
  });
});

describe('[UTILS]: eventsHandlersMap', () => {
  it('contains the NOTIFICATION handler', () => {
    expect(eventsHandlersMap).toHaveProperty('NOTIFICATION');
    expect(typeof eventsHandlersMap.NOTIFICATION).toBe('function');
  });
});
