import { Address } from 'viem';
import { LoadingButtonProps } from '@mui/lab/LoadingButton';
import {NeonPaperProps} from "@src/sections/publication/types.ts"

export interface SponsoredAccessProps {
  holderAddress: Address;
  campaignAddress: Address;
  isActive?: boolean;
  neonPaperProps?: NeonPaperProps;
  buttonProps?: LoadingButtonProps;
  onSuccess?: () => void;
}

export interface ExtendedSponsoredAccessProps extends SponsoredAccessProps {
  size?: 'sm' | 'lg';
}
