import { useEffect, useState } from 'react';
import { supabase } from '@src/utils/supabase';
import { useSelector } from 'react-redux';

export type TransactionData = {
  date: string;
  income: number;
  expenses: number;
};

export const useTransactionData = () => {
  const [data, setData] = useState<TransactionData[]>([]);
  const sessionData = useSelector((state: any) => state.auth.session);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionData?.profile?.id) return;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`receiver_id.eq.${sessionData?.profile?.id},sender_id.eq.${sessionData?.profile?.id}`)
        .order('created_at', { ascending: true });


        if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const groupedData = transactions.reduce((acc: Record<string, TransactionData>, transaction) => {

        const date = new Date(transaction.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, income: 0, expenses: 0 };
        }
        if (transaction.receiver_id === sessionData.profile.id) {
          acc[date].income += transaction.payload.amount;
        }
        if (transaction.sender_id === sessionData.profile.id) {
          acc[date].expenses += transaction.payload.amount;
        }
        return acc;
      }, {});

      setData(Object.values(groupedData));
    };

    fetchData().then(r => console.log(r));
  }, [sessionData]);

  return data;
};
