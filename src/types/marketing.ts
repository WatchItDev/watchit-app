import React from "react";

export type ICampaignTableFilters = {
  status: string;
};
export const CampaignStatusTypes = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];

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
  status: string;
  startDate: string;
  endDate: string;
  sponsoredAccess: number;
  budget: number;
  budgetAvailable: number;
  typeOfCampaign: string;
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
