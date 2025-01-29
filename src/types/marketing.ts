import React from "react";

export type ICampaignTableFilters = {
  status: string;
};
export const CampaignStatusTypes = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];

export interface StrategyType {
  name: string;
  status: string;
  budget: number;
  available: number;
  campaigns: CampaignType[];
}

export interface CampaignType {
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
