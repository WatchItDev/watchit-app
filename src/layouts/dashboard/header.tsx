// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from '@src/theme/css';
// hooks
import { useOffSetTop } from '@src/hooks/use-off-set-top';
import { useResponsive } from '@src/hooks/use-responsive';
// components
import Logo from '@src/components/logo';
import SvgColor from '@src/components/svg-color';
import { useSettingsContext } from '@src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
import { AccountPopover, HeaderXpBalance, HeaderMmcBalance, NotificationsPopover } from '../_common';
import { PropsWithChildren } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawer } from '@redux/drawer';
import { useAuth } from '@src/hooks/use-auth.ts';
import { RootState } from '@redux/store.ts';

// ----------------------------------------------------------------------

export default function Header({ children }: PropsWithChildren) {
  const theme = useTheme();
  const { session: sessionData } = useAuth();
  const lgUp = useResponsive('up', 'lg');
  const dispatch = useDispatch();
  const offset = useOffSetTop(HEADER.H_DESKTOP);
  const settings = useSettingsContext();
  const minibarState = useSelector((state: RootState) => state.minibar.state);

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const offsetTop = offset && !isNavHorizontal;
  const isNavMini = minibarState === 'mini';

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={handleToggleDrawer}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {children}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{ pr: { xs: 0, md: 2 } }}
      >
        {sessionData?.authenticated && (
          <>
            <HeaderXpBalance />
            <HeaderMmcBalance />
            <NotificationsPopover />
          </>
        )}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + NAV.W_MINI + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + NAV.W_VERTICAL_MINI + 2}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: '#1E1F22',
          height: 1,
          px: { lg: 1 },
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
