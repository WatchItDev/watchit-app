import { StackProps } from '@mui/material/Stack';
import { ListItemButtonProps } from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export interface NavConfigProps {
  hiddenLabel?: boolean;
  itemGap?: number;
  iconSize?: number;
  itemRadius?: number;
  itemPadding?: string;
  currentRole?: string;
  itemSubHeight?: number;
  itemRootHeight?: number;
}

export type NavItemProps = ListItemButtonProps & {
  item: NavListProps;
  depth: number;
  open?: boolean;
  active: boolean;
  externalLink?: boolean;
};

export interface NavListProps {
  id?: string;
  title: string;
  path?: string;
  icon?: React.ReactElement;
  info?: React.ReactElement;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  badge?: string | number | React.ReactElement;
  bgColor?: string;
  children?: React.ReactNode;
}

export type NavSectionProps = StackProps & {
  data: {
    subheader?: string;
    items: NavListProps[];
  }[];
  config?: NavConfigProps;
  size?: 'collapsed' | 'full';
};
