import React from "react";
import { Address } from 'viem';

export type ICampaignTableFilters = {
  status: string;
};
export const CampaignStatusTypes = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];

export type CampaignCategoryType = 'subscription' | 'rental' | 'trial' | 'custom';
export type CampaignStatusType = 'active' | 'paused';

export interface StrategyType {
  id: string;
  name: string;
  status: string;
  budget: number;
  available: number;
  campaigns: CampaignType[];
}

export interface CampaignType {
  campaign: Address;
  name: string;
  policy: Address;
  expiration: number;
}

export type Accumulator = Record<string, number>;

export interface StrategyListProps {
  data: StrategyType[];
}

export interface CounterItemProps {
  icon: React.ReactNode;
  number: number;
  label: string;
}

export const CampaignCategories = [
  { value: 'subscription', label: 'Subscription based' },
  { value: 'rental', label: 'Rental based' },
  { value: 'trial', label: 'Trial based' },
  { value: 'custom', label: 'Custom' },
]


export const CAMPAIGN_TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 300 },
  { id: 'limit', label: 'Limit', minWidth: 100},
  { id: 'budget', label: 'Budget', minWidth: 100},
  { id: 'usage', label: 'Usage', minWidth: 100},
  { id: 'expiration', label: 'Expiration', minWidth: 100 },
  { id: 'type', label: 'Type', minWidth: 100},
  { id: 'status', label: 'Status', minWidth: 100 },
];

export interface CampaignTableRowType extends CampaignType {}
