import { COLORS } from '@src/sections/finance/CONSTANTS.tsx';

export const OWNERSHIP_TABLE_HEAD = [
  { id: 'name', label: 'Publication', minWidth: 300 },
  { id: 'limit', label: 'Policies', minWidth: 100},
  { id: 'budget', label: 'Restrictions', minWidth: 100},
  { id: 'status', label: 'Status', minWidth: 100 },
];

export const LBL_STATUS_COLORS  = {
  active: COLORS.success,
  deactivated: COLORS.warning,
};

export const LBL_TYPES_TEXTS = [
  {id: 1,name: "Subscription"},
  {id: 2,name: "Rent"},
  {id: 3,name: "Buy",}
];

export const LBL_REGIONS_TEXTS = [
  {id: 1,name: "US"},
  {id: 2,name: "EU"},
  {id: 3,name: "ASIA"},
  {id: 4,name: "LATAM"},
  {id: 5,name: "AFRICA"},
]
