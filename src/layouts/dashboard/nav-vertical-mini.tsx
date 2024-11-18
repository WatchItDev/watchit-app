// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from '@src/theme/css';
// hooks
import { useMockedUser } from '@src/hooks/use-mocked-user';
// components
import { NavSectionVerticalMini } from '@src/components/nav-section/mini/nav-section-vertical-mini.tsx';
// Projects
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import {NavToggleButton, Searchbar} from '../_common';

// ----------------------------------------------------------------------

export default function NavVerticalMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL_MINI },
        backgroundColor: '#232428',
      }}
    >
      <Searchbar />
      <NavToggleButton
        sx={{
          top: NAV.TOGGLE_TOP,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_VERTICAL_MINI ,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <NavSectionVerticalMini
          data={navData}
          config={{
            currentRole: user?.role || 'admin',
          }}
        />
      </Stack>
    </Box>
  );
}
