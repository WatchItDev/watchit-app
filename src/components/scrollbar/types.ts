import { Props } from 'simplebar-react';
// @mui
import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}
