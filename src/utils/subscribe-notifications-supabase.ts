import { supabase } from '@src/utils/supabase';
import { Dispatch } from 'redux';
import {Events} from "@src/utils/events.ts";

/**
 * Subscribe to notifications channel from Supabase
 * @param profileId
 * @param dispatch
 */
export function subscribeToNotifications(profileId: string, dispatch?: Dispatch) {
  supabase
    .channel('notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `receiver_id=eq.${profileId}`}, payload => {
      Events.Handlers(payload, profileId, dispatch)
    })
    // This is a handler when update the notifications table manually using the Supabase Dashboard
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `receiver_id=eq.${profileId}`}, payload => {
      Events.Handlers(payload, profileId, dispatch)
    })
    .subscribe();
}
