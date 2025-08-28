export const COLORS = {
  success: '#00AB55',
  danger: '#FF4842',
  warning: '#dc9f00',
  info: '#3a7dd5',
};

export const TX_COLORS = {
  transferTo: COLORS.danger,
  transferFrom: COLORS.success,
  deposit: COLORS.success,
  withdraw: COLORS.danger,
  locked: COLORS.info,
  claimed: COLORS.success,
  approved: COLORS.warning,
  collected: COLORS.danger,
  released: COLORS.success,
};

export const FINANCE_STATISTICS_INFLOW_EVENTS = ['transferFrom', 'deposit'];
export const FINANCE_STATISTICS_OUTFLOW_EVENTS = [
  'transferTo',
  'withdraw',
  'collected',
  'paid',
];
