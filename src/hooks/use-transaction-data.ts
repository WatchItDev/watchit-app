import { useEffect, useState } from 'react';
import { supabase } from '@src/utils/supabase';
import { useAuth } from '@src/hooks/use-auth.ts';

export interface TransactionType {
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
    };
    type: string;
    amount: number;
    address: string;
    message?: string;
    category: string;
  };
}

export interface TableRowTransactionType {
  id: string;
  name: string;
  avatarUrl: string;
  amount: string | null;
  type: string;
  date: bigint;
  status: string;
  message: string;
  category: string;
}

export interface TransactionData {
  date: string;
  income: number;
  expenses: number;
}

export interface TransactionsDataResponseHook {
  data: TransactionData[];
  rawData: TransactionType[];
}

export const useTransactionData = (): TransactionsDataResponseHook => {
  const [data, setData] = useState<TransactionData[]>([]);
  const [rawData, setRawData] = useState<TransactionType[]>([]);
  const { session: sessionData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionData?.profile?.id) return;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .or(
          `receiver_id.eq.${sessionData?.profile?.id},sender_id.eq.${sessionData?.profile?.id}`,
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const processedTransactions = transactions.map(
        (transaction: TransactionType) => ({
          ...transaction,
          payload: {
            ...transaction.payload,
            type:
              transaction.sender_id === sessionData?.profile?.id
                ? 'Outflows'
                : 'Inflows',
          },
        }),
      );

      setRawData(processedTransactions);

      const groupedData = transactions.reduce(
        (acc: Record<string, TransactionData>, transaction) => {
          const date = new Date(transaction.created_at)
            .toISOString()
            .split('T')[0];
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
        },
        {},
      );

      setData(Object.values(groupedData));
    };

    fetchData().then((r) => console.log(r));
  }, [sessionData]);

  return { data, rawData };
};
