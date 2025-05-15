import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system/styleFunctionSx';
import { User } from '@src/graphql/generated/graphql.ts';

export interface FollowerItemProps {
  profile: User;
  onClick?: () => void;
  onActionFinished?: () => void;
  sx?: SxProps<Theme>;
}
