import React from "react";

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
  id: string;
  name: string;
  status: CampaignStatusType;
  startDate: string;
  endDate: string;
  access: string;
  budget: string;
  available: string;
  perUser: string;
  type: CampaignCategoryType;
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
  { id: 'name', label: 'Name', width: 400 },
  { id: 'budget', label: 'Budget'},
  { id: 'available', label: 'Available'},
  { id: 'type', label: 'Type'},
  { id: 'access', label: 'Access' },
  { id: 'status', label: 'Status' },
];

export interface CampaignTableRowType extends CampaignType {}
