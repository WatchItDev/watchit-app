import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { GLOBAL_CONSTANTS } from '@src/config-global';
import { useSelector } from 'react-redux';
import {
  fetchInvitations as fetchInvitationsAction,
  checkIfMyEmailHasPendingInvite as checkIfMyEmailHasPendingInviteAction,
  acceptInvitation as acceptInvitationAction,
  checkIfInvitationSent as checkIfInvitationSentAction,
  checkIfEmailAlreadyAccepted as checkIfEmailAlreadyAcceptedAction,
  sendInvitation as sendInvitationAction,
  acceptOrCreateInvitationForUser as acceptOrCreateInvitationForUserAction
} from '@src/utils/supabase-actions';

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
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userEmail = useSelector((state: any) => state.auth.email);
  const sessionData = useSelector((state: any) => state.auth.session);

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

  const acceptInvitation = async (invitationId: string): Promise<Invitation | null> => {
    setLoading(true);
    setError(null);

    const { data, error } = await acceptInvitationAction(invitationId, sessionData?.profile?.id);

    if (error) {
      setError(error);
      setLoading(false);
      return null;
    }

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

  const sendInvitation = async (destination: string, payload: any): Promise<void> => {
    const { error } = await sendInvitationAction(destination, payload, userEmail, sessionData);

    if (error) {
      console.error('Error storing invitation in Supabase:', error);
      throw new Error(error);
    } else {
      console.log('Invitation stored successfully in Supabase.');

      await sendEmail({
        to_email: destination,
        from_email: userEmail ?? 'contact@watchit.movie',
        from_name: payload?.data?.from?.displayName ?? 'Watchit Web3xAI',
      });
    }
  };

  const acceptOrCreateInvitationForUser = async () => {
    const { error } = await acceptOrCreateInvitationForUserAction(userEmail, sessionData);

    if (error) {
      console.error('Error in acceptOrCreateInvitationForUser:', error);
    }
  };

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
