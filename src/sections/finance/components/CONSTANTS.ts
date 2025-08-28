import { TRANSACTIONS_TYPES } from '@src/sections/finance/types.ts';

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  ...TRANSACTIONS_TYPES,
];

export const TABLE_HEAD = [
  { id: 'name', label: 'Transaction Info', width: 20 },
  { id: 'createdAt', label: 'Date', width: 40 },
  { id: 'amount', label: 'Amount', width: 40 },
  { id: 'tx', label: 'TX', width: 40 },
];
