import { ProfileSession } from '@lens-protocol/react-web';
import { NOTIFICATION_CATEGORIES } from '@src/layouts/_common/notifications-popover/notification-item.tsx';

type NotificationPayload = {
  type: string;
  category: number;
  data: {
    from: {
      id: string;
      displayName?: string;
      avatar?: string;
    };
    to: {
      id: string;
      displayName?: string;
      avatar?: string;
    };
    content: {
      [key: string]: any;
    };
  };
};

export const useNotificationPayload = (sessionData: ProfileSession | undefined) => {
  const generatePayload = (
    category: keyof { [p: string]: number },
    toProfile: { id: string; displayName: string; avatar: any },
    content: { [p: string]: any }
  ): NotificationPayload => {
    return {
      type: 'NOTIFICATION',
      category: NOTIFICATION_CATEGORIES[category],
      data: {
        from: {
          id: sessionData?.profile?.id ?? '',
          displayName: sessionData?.profile?.metadata?.displayName ?? '',
          avatar:
            (sessionData?.profile?.metadata?.picture as any)?.optimized?.uri ??
            `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${sessionData?.profile?.id}`,
        },
        to: {
          id: toProfile.id,
          displayName: toProfile.displayName,
          avatar: toProfile.avatar ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${toProfile.id}`,
        },
        content,
      },
    };
  };

  return { generatePayload };
};
