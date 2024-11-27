// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
import { useResponsive } from '@src/hooks/use-responsive';
// components
import { useSettingsContext } from '@src/components/settings';
//
import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavVerticalMini from "@src/layouts/dashboard/nav-vertical-mini";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini =<><NavMini /> <NavVerticalMini /></>;

  const renderNavVertical =<><NavMini /><NavVertical openNav={nav.value} onCloseNav={nav.onFalse} /></>;

  if (isMini) {
    return (
      <>
        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {
          lgUp
            ? renderNavVertical
            : (
              <NavVertical
                openNav={nav.value}
                onCloseNav={nav.onFalse}
              />
            )
        }
        <Main>{children}</Main>
      </Box>
    </>
  );
}
