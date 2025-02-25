export type IOrderTableFilterValue = string | Date | null;

export interface IOrderTableFilters {
  status: string;
}

export const TRANSACTIONS_TYPES = [
  {value: "transferTo", label: "Income"},
  {value: "transferFrom", label: "Outcomes"},
];
