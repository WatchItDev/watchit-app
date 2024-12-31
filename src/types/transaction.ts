export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export const TRANSACTIONS_TYPES = [
  { value: 'transferTo', label: 'Income' },
  { value: 'transferFrom', label: 'Outcomes' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdraw', label: 'Withdraw' },
];


