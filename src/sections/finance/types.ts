import { Profile } from '@lens-protocol/react';
import {Address} from "viem"
import {UseWithdrawHook} from "@src/hooks/protocol/types.ts"

export interface WidgetDataPoint {
  x: string;
  y: number;
}

export interface SummaryAndActionsProps {
  percent: number;
  widgetSeriesData: WidgetDataPoint[];
  balanceFromRedux: number;
  following: Profile[] | null | undefined;
  loadingProfiles: boolean;
}

export interface LeftColumnContentProps {
  following: Profile[] | null | undefined;
}

export interface RightSidebarProps {
  following: Profile[] | null | undefined;
  loadingProfiles: boolean;
}

export type IOrderTableFilterValue = string | Date | null;

export interface IOrderTableFilters {
  status: string;
}

export const TRANSACTIONS_TYPES = [
  { value: 'transferTo', label: 'Income' },
  { value: 'transferFrom', label: 'Outcomes' },
];

export interface FinanceWithdrawProps {
  address: Address; // The connected wallet address
  withdrawHook: UseWithdrawHook; // Generic withdraw hook
  onClose: () => void; // Callback to close the modal/dialog
  onChangeWallet?: (address: Address) => void; // Callback to change the new address.
}
