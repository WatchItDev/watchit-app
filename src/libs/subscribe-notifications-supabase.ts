import { supabase } from '@src/utils/supabase';
import { Dispatch } from 'redux';
import { handleEvents } from '@src/utils/events.ts';

export function subscribeToNotifications(
  profileId: string,
  dispatch?: Dispatch,
  tables: string[] = ['notifications']
) {
  const channel = supabase.channel('changes');

  tables.forEach((table) => {
    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter: `receiver_id=eq.${profileId}` },
        (payload) => {
          handleEvents(payload, profileId, dispatch);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter: `receiver_id=eq.${profileId}` },
        (payload) => {
          handleEvents(payload, profileId, dispatch);
        }
      );
  });

  channel.subscribe();
}
