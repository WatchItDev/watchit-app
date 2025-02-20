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
  { id: 'name', label: 'Name' },
  { id: 'limit', label: 'Limit'},
  { id: 'budget', label: 'Budget'},
  { id: 'usage', label: 'Usage'},
  { id: 'access', label: 'Access' },
  { id: 'expiration', label: 'Expiration' },
  { id: 'type', label: 'Type'},
  { id: 'status', label: 'Status' },
];

export interface CampaignTableRowType extends CampaignType {}
