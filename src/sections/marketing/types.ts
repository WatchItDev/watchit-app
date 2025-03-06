import { Address } from 'viem';

export interface CampaignType {
  campaign: Address;
  name: string;
  policy: Address;
  expiration: number;
}

export interface CampaignTableRowType extends CampaignType {}

export interface CampaignTableRowProps {
  row: CampaignTableRowType;
  selected: boolean;
}

export interface CampaignModalContentProps {
  onClose: () => void;
  onConfirm: () => void;
}

export interface CampaignConfiguredIndicatorStateProps {
  isReady: boolean;
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
  campaigns: any[]; //NOSONAR
  loading: boolean; //NOSONAR
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
