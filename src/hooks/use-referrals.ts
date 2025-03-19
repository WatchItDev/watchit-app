import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { Invitation } from '@src/hooks/types';
import {
  fetchInvitations as fetchInvitationsAction,
  checkIfMyEmailHasPendingInvite as checkIfMyEmailHasPendingInviteAction,
  acceptInvitation as acceptInvitationAction,
  checkIfInvitationSent as checkIfInvitationSentAction,
  checkIfEmailAlreadyAccepted as checkIfEmailAlreadyAcceptedAction,
  sendInvitation as sendInvitationAction,
  acceptOrCreateInvitationForUser as acceptOrCreateInvitationForUserAction,
} from '@src/utils/supabase-actions';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useAuth } from '@src/hooks/use-auth.ts';

/**
 * The type for sending emails through EmailJS.
 */
export interface EmailParams {
  to_email: string;
  from_name: string;
}

const useReferrals = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session: sessionData, email: userEmail } = useAuth();

  /**
   * Fetches all invitations from the Supabase 'invitations' table filtered by senderId.
   * This could be used, for example, to list all invitations sent by the current user.
   *
   * @param {string} senderId - The ID of the user who sent the invitations.
   */
  const fetchInvitations = async (senderId: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await fetchInvitationsAction(senderId);

    if (error) {
      setError(error);
    } else {
      setInvitations(data || []);
    }

    setLoading(false);
  };

  /**
   * Checks whether the current user's email has a pending invitation in the 'invitations' table.
   *
   * @returns {Promise<boolean>} - Returns true if there is at least one pending invitation for the current user's email, otherwise false.
   */
  const checkIfMyEmailHasPendingInvite = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const { hasPending, error } = await checkIfMyEmailHasPendingInviteAction(userEmail);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return hasPending;
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

    const { data, error } = await acceptInvitationAction(
      invitationId,
      sessionData?.profile?.id
    );

    if (error) {
      setError(error);
      setLoading(false);
      return null;
    }

    // Update local state to reflect the accepted status
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

    setLoading(false);
    return data;
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

    const { exists, error } = await checkIfInvitationSentAction(userEmail, destinationEmail);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return exists;
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

    const { accepted, error } = await checkIfEmailAlreadyAcceptedAction(destinationEmail);

    if (error) {
      setError(error);
    }

    setLoading(false);
    return accepted;
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
    // Insert a new invitation into Supabase
    const { error } = await sendInvitationAction(destination, payload, userEmail, sessionData);

    if (error) {
      console.error('Error storing invitation in Supabase:', error);
      throw new Error(error);
    } else {
      console.log('Invitation stored successfully in Supabase.');

      // Send the email via EmailJS
      await sendEmail({
        to_email: destination,
        from_name: payload?.data?.from?.displayName ?? 'Watchit Web3xAI',
      });
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
    const { error } = await acceptOrCreateInvitationForUserAction(userEmail, sessionData);

    if (error) {
      console.error('Error in acceptOrCreateInvitationForUser:', error);
    }
  };

  /**
   * Send an email with EmailJS.
   */
  const sendEmail = async (data: EmailParams) => {
    const { from_name, to_email } = data;

    // Set the template parameters for EmailJS
    const templateParams = {
      to_email,
      from_name,
      from_email: GLOBAL_CONSTANTS.SENDER_EMAIL, // <-- Enforcing the global from_email
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
   * Return all state variables and methods so they can be used in any component that imports this hook.
   */
  return {
    // State
    invitations,
    loading,
    error,

    // CRUD/Fetch Methods
    fetchInvitations,
    checkIfMyEmailHasPendingInvite,
    acceptInvitation,
    checkIfInvitationSent,
    checkIfEmailAlreadyAccepted,
    sendInvitation,
    acceptOrCreateInvitationForUser,
    sendEmail,
  };
};

export default useReferrals;
