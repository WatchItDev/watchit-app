import {ProfilePictureSet, ProfileSession} from '@lens-protocol/react-web'
import {dicebear} from "@src/utils/dicebear.ts";
import {NotificationPayload} from "@src/hooks/types.ts"



export const useNotificationPayload = (sessionData: ProfileSession | undefined) => {
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
          id: sessionData?.profile?.id ?? '',
          displayName: sessionData?.profile?.metadata?.displayName ?? '',
          avatar:
            (sessionData?.profile?.metadata?.picture as ProfilePictureSet)?.optimized?.uri ??
            dicebear(sessionData?.profile?.id as string),
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
