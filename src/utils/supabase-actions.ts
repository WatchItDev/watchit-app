import { Invitation } from '@src/types/invitation'
import { supabase } from '@src/utils/supabase'

/**
 * Fetches all invitations from Supabase filtered by senderId.
 */
export const fetchInvitations = async (
  senderId: string
): Promise<{ data: Invitation[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('sender_id', senderId)

    return { data, error: error ? error.message : null }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

/**
 * Checks whether an email has a pending invitation.
 */
export const checkIfMyEmailHasPendingInvite = async (
  userEmail: string
): Promise<{ hasPending: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .eq('status', 'pending')

    return {
      hasPending: !!data && data.length > 0,
      error: error ? error.message : null,
    }
  } catch (err: any) {
    return { hasPending: false, error: err.message }
  }
}

/**
 * Accepts an existing invitation by setting its status to 'accepted'
 * and assigning receiver_id to the current user's profile ID.
 */
export const acceptInvitation = async (
  invitationId: string,
  receiverId: string | null
): Promise<{ data: Invitation | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        receiver_id: receiverId,
      })
      .eq('id', invitationId)
      .single()

    return { data, error: error ? error.message : null }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

/**
 * Checks whether the current user (userEmail) already sent an invitation
 * to destinationEmail.
 */
export const checkIfInvitationSent = async (
  userEmail: string,
  destinationEmail: string
): Promise<{ exists: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('sender_email', userEmail)
      .eq('destination', destinationEmail)

    return {
      exists: !!data && data.length > 0,
      error: error ? error.message : null,
    }
  } catch (err: any) {
    return { exists: false, error: err.message }
  }
}

/**
 * Checks if the specified email already has an accepted invitation.
 */
export const checkIfEmailAlreadyAccepted = async (
  destinationEmail: string
): Promise<{ accepted: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail)
      .eq('status', 'accepted')

    return {
      accepted: !!data && data.length > 0,
      error: error ? error.message : null,
    }
  } catch (err: any) {
    return { accepted: false, error: err.message }
  }
}

/**
 * Sends (inserts) a new invitation in Supabase.
 */
export const sendInvitation = async (
  destination: string,
  payload: any,
  userEmail: string,
  sessionData: any
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from('invitations')
    .insert([
      {
        destination,
        sender_id: payload?.data?.from?.id,
        payload,
        sender_email: userEmail,
        sender_address: sessionData?.address,
      },
    ])

  return { error: error ? error.message : null }
}

/**
 * Accepts the first invitation found for userEmail,
 * or creates a new invitation with status = 'accepted' if none exist.
 */
export const acceptOrCreateInvitationForUser = async (
  userEmail: string,
  sessionData: any
): Promise<{ error: string | null }> => {
  try {
    const { data: invites, error: pendingError } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .limit(1)

    if (pendingError) {
      throw new Error(`Error fetching pending invites: ${pendingError.message}`)
    }

    console.log('acceptOrCreateInvitationForUser invites')
    console.log(invites)

    // If we already have at least one invitation, accept the first.
    if (invites && invites.length > 0) {
      const invitationId = invites[0].id
      const { error } = await acceptInvitation(invitationId, sessionData?.profile?.id)
      if (error) {
        throw new Error(error)
      }
    } else {
      // Otherwise, create a new invitation with status='accepted'
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
              self_register: true,
            },
            status: 'accepted',
          },
        ])

      if (createError) {
        throw new Error(
          `Error creating 'accepted' invitation: ${createError.message}`
        )
      }
    }

    return { error: null }
  } catch (err: any) {
    return { error: err.message }
  }
}

/*
* Verify if the email has already been invited.
* Find in supabase if the email has already been invited, taking the destination email as a parameter.
* */

export const checkIfEmailAlreadyInvited = async (
  destinationEmail: string
): Promise<{ invited: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail)

    return {
      invited: !!data && data.length > 0,
      error: error ? error.message : null,
    }
  } catch (err: any) {
    return { invited: false, error: err.message }
  }
}
