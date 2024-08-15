import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
// routes
import { RouterLink } from 'src/routes/components';
//
import Iconify from '../../iconify';
//
import { NavItemProps, NavConfigProps } from '../types';
import { StyledItem, StyledIcon, StyledNavContent } from './styles';

// ----------------------------------------------------------------------

type Props = NavItemProps & {
  config: NavConfigProps;
};

const NavItem = forwardRef<HTMLDivElement, Props>(
  ({ item, depth, open, active, externalLink, config, ...other }, ref) => {
    const theme = useTheme();

    const { title, path, icon, children, disabled, caption, roles } = item;

    const subItem = depth !== 1;

    const renderContent = (
      <StyledItem
        disableGutters
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        config={config}
        {...other}
      >
        <Box className='menu-pill'
             sx={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '4px',
               height: '100%',
               display: 'flex',
               overflow: 'hidden',
               alignItems: 'center',
               justifyContent: 'flex-start',
               transition: 'all 0.2s ease-in-out'
             }}
        >
          <Box className='pill' sx={{
            width: active ? '4px' : 0 ,
            height: active ? '60%' : 0,
            borderRadius: 0,
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem',
            backgroundColor: '#fff',
            transition: 'all 0.3s ease-in-out'
          }} />
        </Box>

        <StyledNavContent
          active={active}
        >
          {icon && (
            <StyledIcon
              size={config.iconSize}
              sx={{
                width: '1.7rem',
                height: '1.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(subItem && { mr: 1.5 }),
              }}
            >
              {icon}
            </StyledIcon>
          )}

          {!icon && title && (
            <ListItemText
              sx={{
                width: 1,
                flex: 'unset'
              }}
              primary={title.slice(0,4)}
              primaryTypographyProps={{
                noWrap: true,
                fontSize: 14,
                lineHeight: 1,
                textAlign: 'center',
                textTransform: 'capitalize',
                fontWeight: active ? 'fontWeightBold' : 'fontWeightSemiBold',
              }}
            />
          )}
        </StyledNavContent>
      </StyledItem>
    );

    // Hidden item by role
    if (roles && !roles.includes(`${config.currentRole}`)) {
      return null;
    }

    // External link
    if (externalLink)
      return (
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          underline="none"
          sx={{
            width: 1,
            ...(disabled && {
              cursor: 'default',
            }),
          }}
        >
          {renderContent}
        </Link>
      );

    // Default
    return (
      <Link
        component={RouterLink}
        href={path}
        underline="none"
        sx={{
          width: 1,
          ...(disabled && {
            cursor: 'default',
          }),
        }}
      >
        {renderContent}
      </Link>
    );
  }
);

export default NavItem;
