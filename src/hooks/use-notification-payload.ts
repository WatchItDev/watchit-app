import {dicebear} from "@src/utils/dicebear.ts";
import {NotificationPayload} from "@src/hooks/types.ts"
import { ReduxSession } from '@redux/types.ts';

export const useNotificationPayload = (sessionData: ReduxSession | undefined) => {
  const generatePayload = (
    category: string,
    toProfile: { id: string; displayName: string; avatar: string },
    content: Record<string, string>
  ): NotificationPayload => {
    return {
      type: 'NOTIFICATION',
      category: category,
      data: {
        from: {
          id: sessionData?.address ?? '',
          displayName: sessionData?.user?.displayName ?? '',
          avatar: sessionData?.user?.profilePicture ?? dicebear(sessionData?.user?.address as string),
        },
        to: {
          id: toProfile.id,
          displayName: toProfile.displayName,
          avatar: toProfile.avatar ?? dicebear(toProfile.id)},
        content,
      },
    };
  };

  return { generatePayload };
};
