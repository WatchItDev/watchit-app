import { Address } from "viem"
import { UseWithdrawHook } from "@src/hooks/protocol/types.ts"
import { CardProps } from "@mui/material/Card"
import { CarouselReturnType } from "@src/hooks/components/types.ts"
import { InputAmountProps } from "@src/components/input-amount.tsx"
import { DialogProps } from "@mui/material/Dialog"
import { ReactNode } from "react"
import { User } from '@src/graphql/generated/graphql.ts';

export interface WidgetDataPoint {
  x: string;
  y: number;
}

export interface SummaryAndActionsProps {
  percent: number;
  widgetSeriesData: WidgetDataPoint[];
  balanceFromRedux: number;
  following: User[] | null | undefined;
  loadingProfiles: boolean;
}

export interface LeftColumnContentProps {
  following: User[] | null | undefined;
}

export interface RightSidebarProps {
  following: User[] | null | undefined;
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

export interface FinanceContactsCarouselProps extends CardProps {
  title?: string;
  subheader?: string;
  list: User[];
  chunkSize?: number; // how many contacts to display per slide
}

export interface FinanceDialogsActionsProps {
  rainbowComponent: React.ComponentType<RainbowComponentProps>;
  loading: boolean;
  actionLoading: boolean;
  amount: number;
  balance: number;
  label: string;
  onConfirmAction: () => void;
  onCloseAction?: () => void
}

export interface FinanceDisplayNameProps {
  mode: 'profile' | 'wallet';
  initialList?: User[];
  carousel: CarouselReturnType;
}

export type TConfirmTransferDialogProps = InputAmountProps & DialogProps;

export interface ConfirmTransferDialogProps extends TConfirmTransferDialogProps {
  contactInfo?: User;
  address?: string;
  onClose: VoidFunction;
  onFinish: VoidFunction;
  amount: number;
}

export interface TabConfig {
  value: string;
  label: string;
  disabled?: boolean;
  icon: ReactNode;
}

export interface FinanceModalProps extends DialogProps {
  onClose: VoidFunction;
  title: string;
  tabs: TabConfig[];
  renderContent: (currentTab: string) => ReactNode;
}

interface RainbowComponentProps {
  borderRadius?: string;
  animationSpeed?: string;
  padding?: string;
  width?: string;
  children?: React.ReactNode;
}
