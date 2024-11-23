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
import {
  AccountPopover,
  LanguagePopover,
  NotificationsPopover,
} from '../_common';
import { useAccount } from 'wagmi';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const { isConnected } = useAccount();
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{ pr: 2 }}
      >
        {
          isConnected && (
            <LanguagePopover />
          )
        }

        <NotificationsPopover />

        {/*<SettingsButton />*/}

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
          width: `calc(100% - ${NAV.W_VERTICAL + NAV.W_MINI+ 1}px)`,
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
