import { Address } from 'viem';
import { LoadingButtonProps } from '@mui/lab/LoadingButton';

export interface SponsoredAccessProps {
  holderAddress: Address;
  campaignAddress: Address;
  isActive?: boolean;
  neonPaperProps?: any;
  buttonProps?: LoadingButtonProps;
  onSuccess?: () => void;
}

export interface ExtendedSponsoredAccessProps extends SponsoredAccessProps {
  size?: 'sm' | 'lg';
}
