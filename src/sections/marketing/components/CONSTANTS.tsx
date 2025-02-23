import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { COLORS } from '@src/sections/finance/components/CONSTANTS.tsx';

export const CAMPAIGN_TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 300 },
  { id: 'limit', label: 'Limit', minWidth: 100},
  { id: 'budget', label: 'Budget', minWidth: 100},
  { id: 'usage', label: 'Usage', minWidth: 100},
  { id: 'expiration', label: 'Expiration', minWidth: 100 },
  { id: 'type', label: 'Type', minWidth: 100},
  { id: 'status', label: 'Status', minWidth: 100 },
];

export const POLICY_TEXTS: Record<string, string> = {
  [`${GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS?.toLowerCase?.()}`]: "Subscription",
};

export const LBL_COLORS = {
  subscription: COLORS.info,
  rental: COLORS.info,
  trial: COLORS.warning,
  custom: COLORS.danger,
};

export const LBL_STATUS_COLORS = {
  active: COLORS.success,
  paused: COLORS.warning,
  completed: COLORS.warning,
};
