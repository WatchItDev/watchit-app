import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
// routes
import { RouterLink } from 'src/routes/components';
//
import Iconify from '../../iconify';
//
import { NavItemProps, NavConfigProps } from '../types';
import { StyledItem, StyledIcon } from './styles';

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
        {icon && (
          <StyledIcon
            size={config.iconSize}
            sx={{
              ...(subItem && { mr: 1.5 }),
            }}
          >
            {icon}
          </StyledIcon>
        )}

        {!(config.hiddenLabel && !subItem) && (
          <ListItemText
            sx={{
              width: 1,
              flex: 'unset',
              ...(!subItem && {
                px: 0.5,
                mt: 0.5,
              }),
            }}
            primary={title}
            primaryTypographyProps={{
              noWrap: true,
              fontSize: 10,
              lineHeight: '16px',
              textAlign: 'center',
              textTransform: 'capitalize',
              fontWeight: active ? 'fontWeightBold' : 'fontWeightSemiBold',
              ...(subItem && {
                textAlign: 'unset',
                fontSize: theme.typography.body2.fontSize,
                lineHeight: theme.typography.body2.lineHeight,
                fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
              }),
            }}
          />
        )}

        {caption && (
          <Tooltip title={caption} arrow placement="right">
            <Iconify
              width={16}
              icon="eva:info-outline"
              sx={{
                color: 'text.disabled',
                ...(!subItem && {
                  top: 11,
                  left: 6,
                  position: 'absolute',
                }),
              }}
            />
          </Tooltip>
        )}

        {!!children && (
          <Iconify
            width={16}
            icon="eva:arrow-ios-forward-fill"
            sx={{
              top: 11,
              right: 6,
              position: 'absolute',
            }}
          />
        )}
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
