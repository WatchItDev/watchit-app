import {dicebear} from "@src/utils/dicebear.ts";
import { TransactionLog } from '@src/hooks/protocol/types.ts';

export interface ProcessedTransactionData {
  id: string;
  name: string;
  avatarUrl: string;
  type: string;
  message: string;
  category: string;
  date: bigint;
  status: string;
  timestamp?: number;
  amount: string | null;
}

type EventName =
  | 'transferFrom'
  | 'transferTo'
  | 'deposit'
  | 'withdraw'
  | 'locked'
  | 'claimed'
  | 'approved'
  | 'collected'
  | 'released';

type TransactionArgs = Record<string, string | bigint>;

interface EventConfig {
  getName: (args: TransactionArgs) => string;
  getAvatarUrl: (args: TransactionArgs) => string;
}

const eventConfig: Record<EventName, EventConfig> = {
  transferFrom: {
    getName: (args) => String(args.origin),
    getAvatarUrl: (args) => dicebear(String(args.origin)),
  },
  transferTo: {
    getName: (args) => String(args.recipient),
    getAvatarUrl: (args) => dicebear(String(args.recipient)),
  },
  deposit: {
    getName: (args) => String(args.recipient),
    getAvatarUrl: (args) => dicebear(String(args.recipient)),
  },
  withdraw: {
    getName: (args) => String(args.origin),
    getAvatarUrl: (args) => dicebear(String(args.origin)),
  },
  locked: {
    getName: (args) => String(args.account),
    getAvatarUrl: (args) => dicebear(String(args.account)),
  },
  claimed: {
    getName: (args) => String(args.claimer),
    getAvatarUrl: (args) => dicebear(String(args.claimer)),
  },
  approved: {
    getName: (args) => String(args.from),
    getAvatarUrl: (args) => dicebear(String(args.from)),
  },
  collected: {
    getName: (args) => String(args.from),
    getAvatarUrl: (args) => dicebear(String(args.from)),
  },
  released: {
    getName: (args) => String(args.to),
    getAvatarUrl: (args) => dicebear(String(args.to)),
  },
};

export const processTransactionData = (data: TransactionLog[]): ProcessedTransactionData[] => {
  return data.map((transaction) => {
    const config = eventConfig[transaction.event as EventName];
    const name = config ? config.getName(transaction.args) : 'Unknown';
    const avatarUrl = config ? config.getAvatarUrl(transaction.args) : dicebear('default');

    return {
      id: transaction.transactionHash,
      name,
      avatarUrl,
      type: transaction.event,
      message: parseTransactionTypeLabel(transaction.event),
      category: parseTransactionType(transaction.event),
      date: transaction.timestamp,
      status: 'completed',
      amount: transaction.formattedAmount,
    };
  });
};

const parseTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case 'transferTo':
      return 'Transfer to';
    case 'transferFrom':
      return 'Transfer from';
    case 'deposit':
      return 'Deposited';
    case 'withdraw':
      return 'Withdraw';
    case 'approved':
      return 'Approved';
    case 'collected':
      return 'Content Unlocked';

    default:
      return type;
  }
};

// Incomes or outcomes depending on the transaction type
const parseTransactionType = (type: string): string => {
  switch (type) {
    case 'transferFrom':
      return 'income';
    case 'transferTo':
      return 'outcome';
    case 'deposit':
      return 'income';
    case 'withdraw':
      return 'outcome';
    case 'collected':
      return 'outcome';

    default:
      return type;
  }
};

export interface Transaction {
  address: string;
  args: TransactionArgs;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  event: EventName;
  eventName: string;
  formattedAmount: string;
  logIndex: bigint;
  readableDate: string;
  removed: boolean;
  timestamp: bigint;
  topics: string[];
  transactionHash: string;
  transactionIndex: bigint;
}

export function groupTransactionsForWidget(transactions: Transaction[]) {
  if (!transactions?.length) {
    return { daySeriesData: [], calculatedPercent: 0 };
  }

  const grouped: Record<string, number> = {};

  transactions.forEach((tx) => {
    const timestamp = Number(tx.timestamp) * 1000;
    const dateKey = new Date(timestamp).toISOString().slice(0, 10);
    const amount = parseFloat(tx.formattedAmount);
    const eventType = tx.event;

    if (!grouped[dateKey]) grouped[dateKey] = 0;

    if (eventType === 'deposit' || eventType === 'transferTo') {
      grouped[dateKey] += amount;
    } else if (eventType === 'withdraw' || eventType === 'transferFrom') {
      grouped[dateKey] -= amount;
    }
  });

  const daySeriesData = Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b))
    .map((day) => ({
      x: day,
      y: grouped[day],
    }));

  let calculatedPercent = 0;
  if (daySeriesData.length > 1) {
    const first = daySeriesData[0].y;
    const second = daySeriesData[1].y;
    calculatedPercent = ((second - first) / Math.abs(first)) * 100;
  }

  return { daySeriesData, calculatedPercent };
}
