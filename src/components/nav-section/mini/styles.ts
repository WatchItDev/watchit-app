// @mui
import { styled } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
//
import { NavItemProps, NavConfigProps } from '../types';

// ----------------------------------------------------------------------

type StyledItemProps = Omit<NavItemProps, 'item'> & {
  config: NavConfigProps;
  bgColor?: string;
};

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'bgColor',
})<StyledItemProps>(({ active, depth, config, theme, bgColor }) => {
  const subItem = depth !== 1;

  const activeStyles = {
    root: {
      color: theme.palette.text.primary,
    },
    sub: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.action.selected,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  };

  return {
    // Root item
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: config.itemRadius,
    minHeight: config.itemRootHeight,
    color: theme.palette.text.secondary,
    margin: 0,
    padding: '0 !important',
    '&, & *': {
      transition: 'all 0.1s ease-out'
    },
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&:hover .MuiBox-root:not(.svg-color):not(.menu-pill):not(.pill)': {
      borderRadius: '0.75rem',
      backgroundColor: bgColor,
    },
    '&:hover .pill': {
      width: '4px',
      height: '60%'
    },
    // Active root item
    ...(active && {
      ...activeStyles.root,
    }),

    // Sub item
    ...(subItem && {
      margin: 0,
      flexDirection: 'row',
      padding: theme.spacing(0, 1),
      minHeight: config.itemSubHeight,
      // Active sub item
      ...(active && {
        ...activeStyles.sub,
      }),
    }),
  };
});

// ----------------------------------------------------------------------

type StyledNavContentProps = {
  active?: boolean;
};

export const StyledNavContent = styled(Box)<StyledNavContentProps>(({ active, theme }) => ({
  width: '3rem',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // margin: 0,
  margin: '0 0 0 0.1rem',
  backgroundColor: active ? theme.palette.primary.main : '#313339',
  borderRadius: active ? '0.75rem' : '50%',
}));

// ----------------------------------------------------------------------

type StyledIconProps = {
  size?: number;
};

export const StyledIcon = styled(ListItemIcon)<StyledIconProps>(({ size }) => ({
  width: size,
  height: size,
  marginRight: 0,
}));
