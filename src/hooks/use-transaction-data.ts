import { useEffect, useState } from 'react';
import { supabase } from '@src/utils/supabase';
import { useSelector } from 'react-redux';

export type TransactionType = {
  id: number;
  receiver_id: string;
  sender_id: string;
  created_at: string;
  payload: {
    data: {
      to: {
        id: string;
        avatar: string;
        displayName: string;
      };
      from: {
        id: string;
        avatar: string;
        displayName: string;
      };
      content: {
        message: string;
        rawDescription: string;
      };
    },
    type: string;
    amount: number;
    address: string;
    message?: string;
    category: string;
  };
};

export type TableRowTransactionType = {
  id: number;
  name: string;
  avatarUrl: string;
  amount:number | string;
  category: string;
  date: string;
  message: string;
  status: string;
  type: string;
}

export type TransactionData = {
  date: string;
  income: number;
  expenses: number;
};

export type TransactionsDataResponseHook = {
  data: TransactionData[];
  rawData: TransactionType[];
};

export const useTransactionData = (): TransactionsDataResponseHook => {
  const [data, setData] = useState<TransactionData[]>([]);
  const [rawData, setRawData] = useState<TransactionType[]>([]);
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

      const processedTransactions = transactions.map((transaction: TransactionType) => ({
        ...transaction,
        payload: {
          ...transaction.payload,
          type: transaction.sender_id === sessionData?.profile?.id ? 'Outcome' : 'Income',
        },
      }));

      setRawData(processedTransactions);

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

  return { data, rawData };
};
