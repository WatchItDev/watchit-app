import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import {Profile} from "@lens-protocol/api-bindings"

export interface FollowerItemProps {
  profile: Profile;
  onClick?: () => void;
  onActionFinished?: () => void;
  sx?: SxProps<Theme>;
}
