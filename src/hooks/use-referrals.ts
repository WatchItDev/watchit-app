import { useState } from 'react';
import { supabase } from '@src/utils/supabase';
import emailjs from '@emailjs/browser'
import {GLOBAL_CONSTANTS} from "@src/config-global.ts";
import {useSelector} from "react-redux";

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
}

const useReferrals = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userEmail = useSelector((state: any) => state.auth.email);

  const fetchInvitations = async (senderId: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('sender_id', senderId);

    if (error) {
      setError(error.message);
    } else {
      setInvitations(data);
    }

    setLoading(false);
  };

  // Function to send invitation
  async function sendInvitation(destination: string, payload: any) {
    const { error } = await supabase
      .from('invitations')
      .insert([{ destination, sender_id: payload?.data?.from?.id, payload }]);

    if (error) {
      console.error('Error storing email data:', error);
    } else {
      console.log('Email data stored successfully');

      // Send email
      await sendEmail({
        to_email: destination,
        from_email: userEmail ?? 'contact@watchit.movie',
        from_name: payload?.data?.from?.displayName ?? 'Watchit Web3xAI'
      });
    }
  }

  // use emailJS to send email
  async function sendEmail(data: EmailParams) {
    const {from_name, from_email, to_email} = data;

    const templateParams = {
      to_email,
      from_name,
      from_email
    }

    emailjs.send(GLOBAL_CONSTANTS.EMAIL_SERVICE_ID, GLOBAL_CONSTANTS.EMAIL_TEMPLATE_ID, templateParams, GLOBAL_CONSTANTS.EMAIL_API_KEY)
      .then((result) => {
        console.log('Email sent successfully', result.text);
      }, (error) => {
        console.error('Error sending email:', error);
      })
  }



  return { invitations, loading, error, fetchInvitations, sendInvitation, sendEmail };
};

export default useReferrals;
