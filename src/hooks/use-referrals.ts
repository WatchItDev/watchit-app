import { useState } from 'react';
import { supabase } from '@src/utils/supabase';
import emailjs from '@emailjs/browser';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useSelector } from 'react-redux';

export interface Invitation {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  sender_email: string;
  destination: string;
  sender_id: string;
  receiver_id: string | null;
  payload: any;
  created_at: string;
}

export type EmailParams = {
  to_email: string;
  from_email: string;
  from_name: string;
};

const useReferrals = () => {
  /**
   * State variables to manage invitations, loading state, and error messages.
   */
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Retrieve the current user's email and session data from Redux (or your global state).
   * Adjust according to how you store user data in your application.
   */
  const userEmail = useSelector((state: any) => state.auth.email);
  const sessionData = useSelector((state: any) => state.auth.session);

  /**
   * Fetches all invitations from the Supabase 'invitations' table filtered by senderId.
   * This could be used, for example, to list all invitations sent by the current user.
   *
   * @param {string} senderId - The ID of the user who sent the invitations.
   */
  const fetchInvitations = async (senderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('sender_id', senderId);

      if (error) {
        setError(error.message);
      } else {
        setInvitations(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks whether the current user's email has a pending invitation in the 'invitations' table.
   *
   * @returns {Promise<boolean>} - Returns true if there is at least one pending invitation for the current user's email, otherwise false.
   */
  const checkIfMyEmailHasPendingInvite = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('destination', userEmail)
        .eq('status', 'pending');

      if (error) {
        setError(error.message);
        return false;
      }

      return data && data.length > 0;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Accepts an existing invitation by updating its status from 'pending' to 'accepted'.
   * and set the `receiver_id` to the current user's profile ID.
   *
   * @param {string} invitationId - The ID of the invitation to accept.
   * @returns {Promise<Invitation | null>} - Returns the updated invitation if successful, otherwise null.
   */
  const acceptInvitation = async (invitationId: string): Promise<Invitation | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('invitations')
        .update({
          status: 'accepted',
          receiver_id: sessionData?.profile?.id,
        })
        .eq('id', invitationId)
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      // Update local state so the UI immediately reflects the change
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId
            ? {
              ...inv,
              status: 'accepted',
              receiver_id: sessionData?.profile?.id,
            }
            : inv
        )
      );

      return data as Invitation;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks if there is already an invitation from the current user (userEmail) to the given destinationEmail.
   *
   * @param {string} destinationEmail - The email to check against the 'destination' field in the database.
   * @returns {Promise<boolean>} - Returns true if there is an existing invitation, false otherwise.
   */
  const checkIfInvitationSent = async (destinationEmail: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('id')
        .eq('sender_email', userEmail)
        .eq('destination', destinationEmail);

      if (error) {
        setError(error.message);
        return false;
      }

      return data && data.length > 0;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks if the specified email already has an accepted invitation.
   * This is useful to see if the user is already enrolled/registered via invitation.
   *
   * @param {string} destinationEmail - The email to check.
   * @returns {Promise<boolean>} - Returns true if there's an invitation with status 'accepted' for this email, otherwise false.
   */
  const checkIfEmailAlreadyAccepted = async (destinationEmail: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('id')
        .eq('destination', destinationEmail)
        .eq('status', 'accepted');

      if (error) {
        setError(error.message);
        return false;
      }

      return data && data.length > 0;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a new invitation. Inserts a record into the 'invitations' table in Supabase,
   * and then triggers an email using EmailJS.
   *
   * @param {string} destination - The email address of the invitee.
   * @param {any} payload - Additional data you want to attach to the invitation (e.g., sender's profile info).
   * @returns {Promise<void>} - Throws an error if something goes wrong.
   */
  const sendInvitation = async (destination: string, payload: any): Promise<void> => {
    // Insert a new invitation record into Supabase
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

    if (error) {
      console.error('Error storing invitation in Supabase:', error);
      throw new Error(error.message);
    } else {
      console.log('Invitation stored successfully in Supabase.');

      // Send the email using EmailJS
      await sendEmail({
        to_email: destination,
        from_email: userEmail ?? 'contact@watchit.movie',
        from_name: payload?.data?.from?.displayName ?? 'Watchit Web3xAI',
      });
    }
  };

  /**
   * Sends an email using the EmailJS service.
   *
   * @param {EmailParams} data - The email parameters such as the recipient, sender email, and sender name.
   * @returns {Promise<void>} - Resolves if the email is sent successfully, otherwise logs the error.
   */
  const sendEmail = async (data: EmailParams) => {
    const { from_name, from_email, to_email } = data;

    const templateParams = {
      to_email,
      from_name,
      from_email,
    };

    try {
      const result = await emailjs.send(
        GLOBAL_CONSTANTS.EMAIL_SERVICE_ID,
        GLOBAL_CONSTANTS.EMAIL_TEMPLATE_ID,
        templateParams,
        GLOBAL_CONSTANTS.EMAIL_API_KEY
      );
      console.log('Email sent successfully:', result.text);
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  };

  /**
   * ------------------------------------------------------------------
   * Accept or Create an 'accepted' invitation for a given userEmail.
   *
   * 1) If there's any 'pending' invitation with destination = userEmail,
   *    accept the first one found.
   * 2) Otherwise, create a new invitation record with status = 'accepted'.
   * ------------------------------------------------------------------
   */
  const acceptOrCreateInvitationForUser = async () => {
    try {
      // 1) Look for any invitations for this email
      const { data: invites, error: pendingError } = await supabase
        .from('invitations')
        .select('*')
        .eq('destination', userEmail)
        .limit(1);

      if (pendingError) {
        throw new Error(`Error fetching pending invites: ${pendingError.message}`);
      }

      // If a pending invitation exists, accept the first found
      if (invites && invites.length > 0) {
        const invitationId = invites[0].id;
        await acceptInvitation(invitationId);
      } else {
        // If none found, create a new invitation with status = 'accepted'
        console.log('set self invite')
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
              status: 'accepted', // directly set as accepted
            },
          ]);

        if (createError) {
          throw new Error(`Error creating 'accepted' invitation: ${createError.message}`);
        }
      }
    } catch (err) {
      console.error('Error in acceptOrCreateInvitationForUser:', err);
    }
  };

  /**
   * Return all state variables and methods so they can be used in any component that imports this hook.
   */
  return {
    // State
    invitations,
    loading,
    error,

    // Fetch/CRUD Methods
    fetchInvitations,
    sendInvitation,
    sendEmail,

    // Additional Validation/Check Methods
    checkIfMyEmailHasPendingInvite,
    acceptInvitation,
    checkIfInvitationSent,
    checkIfEmailAlreadyAccepted,
    acceptOrCreateInvitationForUser
  };
};

export default useReferrals;
