import { Invitation } from '@src/hooks/types';
import { RootState } from '@src/redux/store';
import { supabase } from '@src/utils/supabase';

class SupabaseError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

/**
 * Creates a SupabaseError from any caught error
 */
const createSupabaseError = (
  message: string,
  error: unknown,
): SupabaseError => {
  if (error instanceof SupabaseError) {
    return error;
  }

  const originalError = error instanceof Error ? error : undefined;
  return new SupabaseError(message, originalError);
};

/**
 * Fetches all invitations from Supabase filtered by senderId.
 */
export const fetchInvitations = async (
  senderId: string,
): Promise<{ data: Invitation[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('sender_id', senderId);

    if (error) throw new SupabaseError(error.message, error);
    return { data, error: null };
  } catch (error) {
    const supaError = createSupabaseError('Error fetching invitations', error);
    console.error(supaError.message);
    return { data: null, error: supaError.message };
  }
};

/**
 * Checks whether an email has a pending invitation.
 */
export const checkIfMyEmailHasPendingInvite = async (
  userEmail: string,
): Promise<{ hasPending: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .eq('status', 'pending');

    if (error) throw new SupabaseError(error.message, error);
    return { hasPending: !!data && data.length > 0, error: null };
  } catch (error) {
    const supaError = createSupabaseError(
      'Error checking pending invitations',
      error,
    );
    console.error(supaError.message);
    return { hasPending: false, error: supaError.message };
  }
};

/**
 * Accepts an existing invitation by setting its status to 'accepted'
 * and assigning receiver_id to the current user's profile ID.
 */
export const acceptInvitation = async (
  invitationId: string,
  receiverId: string | null,
): Promise<{ data: Invitation | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        receiver_id: receiverId,
      })
      .eq('id', invitationId)
      .single();

    if (error) throw new SupabaseError(error.message, error);
    return { data, error: null };
  } catch (error) {
    const supaError = createSupabaseError('Error accepting invitation', error);
    console.error(supaError.message);
    return { data: null, error: supaError.message };
  }
};

/**
 * Checks whether the current user (userEmail) already sent an invitation
 * to destinationEmail.
 */
export const checkIfInvitationSent = async (
  userEmail: string,
  destinationEmail: string,
): Promise<{ exists: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('sender_email', userEmail)
      .eq('destination', destinationEmail);

    if (error) throw new SupabaseError(error.message, error);
    return { exists: !!data && data.length > 0, error: null };
  } catch (error) {
    const supaError = createSupabaseError(
      'Error checking invitation status',
      error,
    );
    console.error(supaError.message);
    return { exists: false, error: supaError.message };
  }
};

/**
 * Checks if the specified email already has an accepted invitation.
 */
export const checkIfEmailAlreadyAccepted = async (
  destinationEmail: string,
): Promise<{ accepted: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail)
      .eq('status', 'accepted');

    if (error) throw new SupabaseError(error.message, error);
    return { accepted: !!data && data.length > 0, error: null };
  } catch (error) {
    const supaError = createSupabaseError(
      'Error checking accepted invitations',
      error,
    );
    console.error(supaError.message);
    return { accepted: false, error: supaError.message };
  }
};

/**
 * Sends (inserts) a new invitation in Supabase.
 */
export const sendInvitation = async (
  destination: string,
  payload: Record<string, unknown>,
  userEmail: string,
  sessionData: RootState,
): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.from('invitations').insert([
      {
        destination,
        sender_id: payload?.data?.from?.id,
        payload,
        sender_email: userEmail,
        sender_address: sessionData?.address,
      },
    ]);

    if (error) throw new SupabaseError(error.message, error);
    return { error: null };
  } catch (error) {
    const supaError = createSupabaseError('Error sending invitation', error);
    console.error(supaError.message);
    return { error: supaError.message };
  }
};

/**
 * Accepts the first invitation found for userEmail,
 * or creates a new invitation with status = 'accepted' if none exist.
 */
export const acceptOrCreateInvitationForUser = async (
  userEmail: string,
  sessionData: RootState,
): Promise<{ error: string | null }> => {
  try {
    const { data: invites, error: pendingError } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .limit(1);

    if (pendingError)
      throw new SupabaseError(pendingError.message, pendingError);

    console.log('acceptOrCreateInvitationForUser invites');
    console.log(invites);

    // If we already have at least one invitation, accept the first.
    if (invites && invites.length > 0) {
      const invitationId = invites[0].id;
      const { error } = await acceptInvitation(
        invitationId,
        sessionData?.profile?.id,
      );
      if (error) throw new SupabaseError(error, undefined);
    } else {
      // Otherwise, create a new invitation with status='accepted'
      const { error: createError } = await supabase.from('invitations').insert([
        {
          destination: userEmail,
          sender_id: sessionData?.profile?.id ?? null,
          sender_address: sessionData?.address ?? null,
          receiver_id: sessionData?.profile?.id ?? null,
          sender_email: userEmail,
          payload: {
            self_register: true,
          },
          status: 'accepted',
        },
      ]);

      if (createError)
        throw new SupabaseError(createError.message, createError);
    }

    return { error: null };
  } catch (error) {
    const supaError = createSupabaseError(
      'Error accepting or creating invitation',
      error,
    );
    console.error(supaError.message);
    return { error: supaError.message };
  }
};

/**
 * Verify if the email has already been invited.
 * Find in supabase if the email has already been invited, taking the destination email as a parameter.
 * */
export const checkIfEmailAlreadyInvited = async (
  destinationEmail: string,
): Promise<{ invited: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail);

    if (error) throw new SupabaseError(error.message, error);
    return { invited: !!data && data.length > 0, error: null };
  } catch (error) {
    const supaError = createSupabaseError(
      'Error checking invited status',
      error,
    );
    console.error(supaError.message);
    return { invited: false, error: supaError.message };
  }
};
