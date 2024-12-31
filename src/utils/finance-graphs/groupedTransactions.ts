import {TransactionData} from '@src/hooks/use-transaction-data';
import {TransactionLog} from "@src/hooks/use-get-smart-wallet-transactions.ts";
type GroupedData = {
  type: string;
  data: {
    name: string;
    data: number[];
  }[];
  categories: string[];
};

export const groupedTransactionData = (data: TransactionData[]): GroupedData[] => {
  const weekData: Record<string, { income: number; expenses: number }> = {};
  const monthData: Record<string, { income: number; expenses: number }> = {};
  const yearData: Record<string, { income: number; expenses: number }> = {};
  const dayData: Record<string, { income: number; expenses: number }> = {};
  const now = new Date();
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);

  data.forEach(({ date, income, expenses }) => {
    const week = getWeek(date);
    const month = date.slice(0, 7); // YYYY-MM
    const year = date.slice(0, 4); // YYYY
    const transactionDate = new Date(date);

    if (!weekData[week]) weekData[week] = { income: 0, expenses: 0 };
    if (!monthData[month]) monthData[month] = { income: 0, expenses: 0 };
    if (!yearData[year]) yearData[year] = { income: 0, expenses: 0 };

    weekData[week].income += income;
    weekData[week].expenses += expenses;
    monthData[month].income += income;
    monthData[month].expenses += expenses;
    yearData[year].income += income;
    yearData[year].expenses += expenses;

    if (transactionDate >= sixtyDaysAgo && transactionDate <= now) {
      if (!dayData[date]) dayData[date] = { income: 0, expenses: 0 };
      dayData[date].income += income;
      dayData[date].expenses += expenses;
   }
  });

  return [
    {
      type: 'Week',
      data: [
        { name: 'Income', data: Object.values(weekData).map(d => d.income) },
        { name: 'Expenses', data: Object.values(weekData).map(d => d.expenses) },
      ],
      categories: Object.keys(weekData),
    },
    {
      type: 'Month',
      data: [
        { name: 'Income', data: Object.values(monthData).map(d => d.income) },
        { name: 'Expenses', data: Object.values(monthData).map(d => d.expenses) },
      ],
      categories: Object.keys(monthData),
    },
    {
      type: 'Year',
      data: [
        { name: 'Income', data: Object.values(yearData).map(d => d.income) },
        { name: 'Expenses', data: Object.values(yearData).map(d => d.expenses) },
      ],
      categories: Object.keys(yearData),
    },
    {
      type: 'Day',
      data: [
        { name: 'Income', data: Object.values(dayData).map(d => d.income) },
        { name: 'Expenses', data: Object.values(dayData).map(d => d.expenses) },
      ],
      categories: Object.keys(dayData),
    },
  ];
};


// Helper function to get the week number of a date
const getWeek = (date: string): string => {
  const d = new Date(date);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${weekNumber}`;
};

// Helper function to process day data to the desired format
export const processDayData = (groupedData: GroupedData[]): { x: string, y: number }[] => {
  const dayData = groupedData.find(group => group.type === 'Day');
  if (!dayData) return [];

  return dayData.categories.map((date, index) => {
    const income = dayData.data[0].data[index];
    const expenses = dayData.data[1].data[index];
    const monthDay = date.slice(5, 10); // MM-DD
    return { x: monthDay, y: income - expenses };
  });
};


export type ProcessedTransactionData = {
  id: string;
  name: string;
  avatarUrl: string;
  type: string;
  message: string;
  category: string;
  date: bigint;
  status: string;
  amount: string | null;
};

export const processTransactionData = (data: TransactionLog[]): ProcessedTransactionData[] => {
  return data.map((transaction, _index) => ({
    id: transaction.transactionHash,
    name: transaction.event === 'transferFrom' ? transaction.args.sender : transaction.args.recipient,
    avatarUrl: '',
    type: transaction.event,
    message: transaction.event === 'transferTo' ? 'Sent money to' : 'Received money from',
    category: transaction.event === 'transferFrom' ? transaction.args.recipient : transaction.args.sender,
    date: transaction.timestamp,
    status: 'completed',
    amount: transaction.formattedAmount,
  }));
};
