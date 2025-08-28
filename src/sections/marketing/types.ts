import { Address } from 'viem';
import { CampaignLog } from '@src/hooks/protocol/types.ts';

export interface CampaignType {
  campaign: Address;
  name: string;
  policy: Address;
  expiration: number;
}

export interface CampaignTableRowProps {
  row: CampaignType;
  selected: boolean;
}

export interface CampaignModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

export interface CampaignConfiguredIndicatorStateProps {
  isReady: boolean;
  disabled: boolean;
}

export interface CampaignCreateProps {
  onSuccess?: () => void;
}

export interface CampaignSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  campaignData: {
    address: Address;
    description: string;
  };
}

export interface CampaignSettingsModalContentProps {
  onClose?: () => void;
  onConfirm?: () => void;
  campaignData: {
    address: Address;
    description: string;
  };
}

export interface CampaignTableProps {
  campaigns: CampaignLog[];
  loading: boolean;
}

export interface CampaignWithdrawFundsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  campaignData: {
    address: Address;
    description: string;
    currentFundsBalance: string;
  };
}

export interface CampaignWithdrawFundsModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
  campaignData: {
    address: Address;
    description: string;
    currentFundsBalance: string;
  };
}

export interface FormattedCampaign {
  campaign: string;
  name: string;
  policy: string;
  expiration: bigint;
}
