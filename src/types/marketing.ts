import { Address } from 'viem';

export interface CampaignType {
  campaign: Address;
  name: string;
  policy: Address;
  expiration: number;
}

export interface CampaignTableRowType extends CampaignType {}
