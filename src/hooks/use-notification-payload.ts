import { ProfileSession } from '@lens-protocol/react-web';

type NotificationPayload = {
  type: string;
  category: string;
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
    category: string,
    toProfile: { id: string; displayName: string; avatar: any },
    content: { [p: string]: any }
  ): NotificationPayload => {
    return {
      type: 'NOTIFICATION',
      category: category,
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
