import { supabase } from '@src/utils/supabase';
import { Invitation } from '@src/types/invitation';

/**
 * Fetches invitations sent by a specific sender.
 *
 * This asynchronous function retrieves a list of invitations from the "invitations" database table
 * based on the `senderId` provided. If successful, it returns the list of invitations and null for the error.
 * If an error occurs, it returns null for the data and an error message.
 *
 * @param {string} senderId - The ID of the sender whose invitations are to be fetched.
 * @returns {Promise<{ data: Invitation[] | null, error: string | null }>} A promise that resolves to an object containing:
 * - `data`: An array of invitations or null if an error occurs.
 * - `error`: A string describing the error or null if no error occurs.
 */
export const fetchInvitations = async (
  senderId: string
): Promise<{ data: Invitation[] | null; error: string | null }> => {
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

/**
 * Asynchronously checks if a given email address has any pending invitations in the database.
 *
 * @param {string} userEmail - The email address to check for pending invitations.
 * @returns {Promise<{ hasPending: boolean; error: string | null }>} An object containing:
 *  - `hasPending`: A boolean indicating if there is any pending invitation for the provided email.
 *  - `error`: A string containing error details if an error occurred, or `null` if no error occurred.
 *
 * The function queries the "invitations" table in the database to determine if there are
 * any records with a destination matching the provided email and a status of "pending".
 * If an error occurs during the query, it returns an object with `hasPending` set to `false`
 * and the error message under the `error` field.
 */
export const checkIfMyEmailHasPendingInvite = async (
  userEmail: string
): Promise<{ hasPending: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('destination', userEmail)
      .eq('status', 'pending');

    return {
      hasPending: !!data && data.length > 0,
      error: error ? error.message : null,
    };
  } catch (err: any) {
    return { hasPending: false, error: err.message };
  }
};

/**
 * Accepts an invitation by updating its status to "accepted" and associates it with a receiver ID.
 *
 * @param {string} invitationId - The unique identifier of the invitation to be accepted.
 * @param {string | null} receiverId - The ID of the receiver accepting the invitation, or null if not applicable.
 * @returns {Promise<{ data: Invitation | null, error: string | null }>}
 *          A promise resolving to an object containing the updated invitation data or an error message.
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
      .single();

    return { data, error: error ? error.message : null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Asynchronously checks if an invitation has already been sent from a specific user to a destination email address.
 *
 * @param {string} userEmail - The email address of the sender.
 * @param {string} destinationEmail - The email address of the recipient.
 * @returns {Promise<{ exists: boolean, error: string | null }>}
 * A promise that resolves to an object containing:
 * - `exists`: A boolean indicating whether the invitation exists (`true`) or not (`false`).
 * - `error`: A string containing the error message if an error occurred, or `null` if no error occurred.
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
      .eq('destination', destinationEmail);

    return {
      exists: !!data && data.length > 0,
      error: error ? error.message : null,
    };
  } catch (err: any) {
    return { exists: false, error: err.message };
  }
};

/**
 * Checks if an email has already been accepted in the invitations table.
 *
 * This function queries the database to determine whether a specific email
 * has a corresponding invitation with a status of 'accepted'.
 *
 * @param {string} destinationEmail - The email address to be checked for acceptance.
 * @returns {Promise<{accepted: boolean, error: string | null}>} A promise that resolves to an object containing:
 *   - `accepted`: A boolean indicating whether the email is already accepted.
 *   - `error`: A string containing an error message if an error occurred, or `null` if no error occurred.
 */
export const checkIfEmailAlreadyAccepted = async (
  destinationEmail: string
): Promise<{ accepted: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail)
      .eq('status', 'accepted');

    return {
      accepted: !!data && data.length > 0,
      error: error ? error.message : null,
    };
  } catch (err: any) {
    return { accepted: false, error: err.message };
  }
};

/**
 * Sends an invitation to the specified destination.
 *
 * Inserts a new record into the 'invitations' table with details of the
 * invitation, including destination, sender ID, sender email, and
 * associated payload and session data.
 *
 * @param {string} destination - The target destination for the invitation.
 * @param {any} payload - The data payload containing details about the invitation.
 * @param {string} userEmail - The email of the user sending the invitation.
 * @param {any} sessionData - Additional session data associated with the sender.
 * @returns {Promise<{ error: string | null }>} A promise that resolves to an
 * object containing an error message if the invitation could not be sent,
 * or null if successful.
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
    ]);

  return { error: error ? error.message : null };
};

/**
 * Handles accepting or creating an invitation for a user based on their email.
 *
 * This function attempts to find a pending invitation for the given email address.
 * If a pending invitation exists, it accepts the invitation. If no pending invitation
 * is found, it creates a new invitation and marks it as "accepted."
 *
 * @param {string} userEmail - The email address of the user to accept or create an invitation for.
 * @param {any} sessionData - The session data associated with the user, containing profile and other information.
 * @returns {Promise<{ error: string | null }>} A promise resolving to an object containing an error message
 *                                           if an error occurs, or null in case of success.
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
      .limit(1);

    if (pendingError) {
      throw new Error(`Error fetching pending invites: ${pendingError.message}`);
    }

    console.log('acceptOrCreateInvitationForUser invites')
    console.log(invites)

    // If we already have at least one invitation, accept the first.
    if (invites && invites.length > 0) {
      const invitationId = invites[0].id;
      const { error } = await acceptInvitation(invitationId, sessionData?.profile?.id);
      if (error) {
        throw new Error(error);
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
        ]);

      if (createError) {
        throw new Error(
          `Error creating 'accepted' invitation: ${createError.message}`
        );
      }
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message };
  }
};


/**
 * Checks if the given email address has already been invited.
 *
 * This function queries the 'invitations' table to determine
 * whether the specified destination email address has an
 * existing invitation entry. Returns an object indicating
 * whether the email has been invited and any potential error.
 *
 * @async
 * @function
 * @param {string} destinationEmail - The email address to check for an existing invitation.
 * @returns {Promise<{ invited: boolean, error: string | null }>}
 * An object with `invited` indicating whether the email is already invited,
 * and `error` containing the error message if there is one, otherwise null.
 */
export const checkIfEmailAlreadyInvited = async (
  destinationEmail: string
): Promise<{ invited: boolean; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('id')
      .eq('destination', destinationEmail);

    return {
      invited: !!data && data.length > 0,
      error: error ? error.message : null,
    };
  } catch (err: any) {
    return { invited: false, error: err.message };
  }
};


/**
 * Stores or updates IP and related geolocation information in Supabase.
 *
 * This function checks if a record exists in Supabase for the provided address or IP.
 * If an address exists, it updates the geolocation payload and visit count, and updates the IP if it has changed.
 * If the address does not exist, it checks for an existing record by IP and updates the payload and visit count.
 * If neither the address nor the IP exists in the database, a new record is created.
 *
 * @async
 * @function
 * @param {string} ip - The IP address to be stored or updated in the database.
 * @param {any} data - The geolocation data to be stored or merged with existing data.
 * @param {string} address - The address associated with the geolocation information.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws Will log errors to the console if any issues occur during database operations.
 */
export const storeIpInfoInSupabase = async (ip: string, data: any, address: string): Promise<void> => {
  try {
    // Check if the address exists
    const { data: addressData, error: addressError } = await supabase
      .from('geolocations')
      .select('*')
      .eq('address', address);

    if (addressError) {
      console.error('Error fetching address info:', addressError);
      return;
    }

    // If the address exists, update the payload and visits
    if (addressData && addressData.length > 0) {
      const { id, payload, visits, ip: existingIp } = addressData[0];
      const newPayload = { ...payload, ...data };

      // Update IP if it has changed
      if (existingIp !== ip) {
        const { error: updateError } = await supabase
          .from('geolocations')
          .update({ ip, payload: newPayload, visits: visits + 1, updated_at: new Date() })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating IP info:', updateError);
        }
      } else {
        // Update payload and visits if IP has not changed
        const { error: updateError } = await supabase
          .from('geolocations')
          .update({ payload: newPayload, visits: visits + 1, updated_at: new Date() })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating payload info:', updateError);
        }
      }
    } else {
      // Check if the IP exists
      const { data: ipData, error: ipError } = await supabase
        .from('geolocations')
        .select('*')
        .eq('ip', ip);

      if (ipError) {
        console.error('Error fetching IP info:', ipError);
        return;
      }

      if (ipData && ipData.length > 0) {
        const { id, payload, visits } = ipData[0];
        const newPayload = { ...payload, ...data };

        const { error: updateError } = await supabase
          .from('geolocations')
          .update({ payload: newPayload, visits: visits + 1, updated_at: new Date() })
          .eq('id', id);

        if (updateError) {
          console.error('Error updating IP info:', updateError);
        }
      } else {
        // Insert new record if neither address nor IP exists
        const { error: insertError } = await supabase.from('geolocations').insert([
          { ip, payload: data, visits: 1, address },
        ]);

        if (insertError) {
          console.error('Error inserting IP info:', insertError);
        }
      }
    }
  } catch (err: any) {
    console.error('Error in storeIpInfoInSupabase:', err.message);
  }
};
