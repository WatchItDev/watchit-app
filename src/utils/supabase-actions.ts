import { supabase } from '@src/utils/supabase';
import { Invitation } from '@src/hooks/use-referrals';

export const fetchInvitations = async (senderId: string): Promise<{ data: Invitation[] | null, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('sender_id', senderId);

    return { data, error: error ? error.message : null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

export const checkIfMyEmailHasPendingInvite = async (userEmail: string): Promise<{ hasPending: boolean, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .eq('status', 'pending');

    return { hasPending: data && data.length > 0, error: error ? error.message : null };
  } catch (err: any) {
    return { hasPending: false, error: err.message };
  }
};

export const acceptInvitation = async (invitationId: string, receiverId: string | null): Promise<{ data: Invitation | null, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        receiver_id: receiverId,
      })
      .eq('id', invitationId)
      .single();

    return { data, error: error ? error.message : null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

export const checkIfInvitationSent = async (userEmail: string, destinationEmail: string): Promise<{ exists: boolean, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('sender_email', userEmail)
      .eq('destination', destinationEmail);

    return { exists: data && data.length > 0, error: error ? error.message : null };
  } catch (err: any) {
    return { exists: false, error: err.message };
  }
};

export const checkIfEmailAlreadyAccepted = async (destinationEmail: string): Promise<{ accepted: boolean, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail)
      .eq('status', 'accepted');

    return { accepted: data && data.length > 0, error: error ? error.message : null };
  } catch (err: any) {
    return { accepted: false, error: err.message };
  }
};

export const sendInvitation = async (destination: string, payload: any, userEmail: string, sessionData: any): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from('invitations')
    .insert([
      {
        destination,
        sender_id: payload?.data?.from?.id,
        payload,
        sender_email: userEmail,
        sender_address: sessionData?.address,
      }
    ]);

  return { error: error ? error.message : null };
};

export const acceptOrCreateInvitationForUser = async (userEmail: string, sessionData: any): Promise<{ error: string | null }> => {
  try {
    const { data: invites, error: pendingError } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .limit(1);

    if (pendingError) {
      throw new Error(`Error fetching pending invites: ${pendingError.message}`);
    }

    if (invites && invites.length > 0) {
      const invitationId = invites[0].id;
      const { error } = await acceptInvitation(invitationId, sessionData?.profile?.id);
      if (error) {
        throw new Error(error);
      }
    } else {
      const { error: createError } = await supabase
        .from('invitations')
        .insert([
          {
            destination: userEmail,
            sender_id: sessionData?.profile?.id ?? null,
            sender_address: sessionData?.address ?? null,
            receiver_id: sessionData?.profile?.id ?? null,
            sender_email: userEmail,
            payload: {
              self_invite: true
            },
            status: 'accepted',
          },
        ]);

      if (createError) {
        throw new Error(`Error creating 'accepted' invitation: ${createError.message}`);
      }
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message };
  }
};
