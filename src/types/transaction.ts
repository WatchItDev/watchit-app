import {TableRowTransactionType, TransactionType} from "@src/hooks/use-transaction-data.ts";

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export const TRANSACTIONS_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'outcome', label: 'Outcomes' },
];

export const transactions = (data: TransactionType[]): TableRowTransactionType[] => {
  return data.map((transaction: TransactionType) => {
    return {
      id: transaction?.id,
      avatarUrl: transaction?.payload?.type === 'Income' ? transaction?.payload?.data?.from?.avatar: transaction?.payload?.data?.to?.avatar,
      category: transaction?.payload?.category,
      date: transaction?.created_at,
      amount: transaction?.payload?.amount,
      message: transaction?.payload?.data?.content?.message,
      name: transaction?.payload?.type === 'Income' ? transaction?.payload?.data?.from?.displayName: transaction?.payload?.data?.to?.displayName,
      status: transaction?.payload?.data?.content?.rawDescription,
      type: transaction?.payload?.type,
    };
  });
};


