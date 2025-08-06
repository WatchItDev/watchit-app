import { useRef, useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
// routes
import { RouterLink } from '@src/routes/components';
//
import Iconify from '../../iconify';
//
import { NavItemProps, NavConfigProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';

// ----------------------------------------------------------------------

type Props = NavItemProps & {
  config: NavConfigProps;
};

export default function NavItem({
                                  item,
                                  open,
                                  depth,
                                  active,
                                  config,
                                  externalLink,
                                  ...other
                                }: Props) {
  const { title, path, icon, info, children, disabled, caption, roles } = item;

  const subItem = depth !== 1;

  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleOpen = useCallback(() => setPopoverOpen(true), []);
  const handleClose = useCallback(() => setPopoverOpen(false), []);

  const comingSoonText = caption || '✨ Coming soon';

  const renderContent = (
    <StyledItem
      disableGutters
      disabled={disabled}
      active={active}
      depth={depth}
      config={config}
      {...other}
    >
      <>
        {icon && <StyledIcon size={config.iconSize}>{icon}</StyledIcon>}

        {subItem && (
          <StyledIcon size={config.iconSize}>
            <StyledDotIcon active={active} />
          </StyledIcon>
        )}
      </>

      {!(config.hiddenLabel && !subItem) && (
        <ListItemText
          primary={title}
          secondary={disabled ? null : undefined}
          primaryTypographyProps={{
            noWrap: true,
            typography: 'body2',
            textTransform: 'capitalize',
            fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
          }}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      )}

      {info && (
        <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
          {info}
        </Box>
      )}

      {!!children && (
        <Iconify
          width={16}
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          sx={{ ml: 1, flexShrink: 0 }}
        />
      )}
    </StyledItem>
  );

  // Hidden item by role
  if (roles && !roles.includes(`${config.currentRole}`)) {
    return null;
  }

  const commonLinkProps = {
    underline: 'none' as const,
    color: 'inherit',
    'aria-disabled': disabled ? 'true' : undefined,
    onClick: (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    sx: {
      ...(disabled && {
        cursor: 'not-allowed',
        pointerEvents: 'auto',
      }),
    },
  };

  let clickableEl: React.ReactNode;

  if (externalLink) {
    clickableEl = (
      <Link href={path} target="_blank" rel="noopener" {...commonLinkProps}>
        {renderContent}
      </Link>
    );
  } else if (children) {
    clickableEl = renderContent;
  } else {
    clickableEl = (
      <Link component={RouterLink} href={path ?? '/'} {...commonLinkProps}>
        {renderContent}
      </Link>
    );
  }

  if (!disabled) {
    return <>{clickableEl}</>;
  }

  return (
    <>
      <Box
        component="span"
        ref={anchorRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        sx={{ display: 'inline-flex', width: '100%' }}
      >
        {clickableEl}
      </Box>

      <Popover
        open={popoverOpen}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
            sx: {
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 8px',
              borderRadius: 1,
              ...(popoverOpen && { pointerEvents: 'auto' }),
            },
          },
        }}
        sx={{ pointerEvents: 'none' }}
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <small>{comingSoonText}</small>
        </Stack>
      </Popover>
    </>
  );
}
