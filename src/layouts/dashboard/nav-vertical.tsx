import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '@src/redux/drawer';

// REACT IMPORTS
import { useEffect } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

// COMPONENTS IMPORTS
import Scrollbar from '@src/components/scrollbar';
import { NavSectionVertical } from '@src/components/nav-section';

// HOOKS IMPORTS
import { useResponsive } from '@src/hooks/use-responsive';
import { usePathname } from '@src/routes/hooks';
import { useNavData } from './config-navigation';

// LAYOUT IMPORTS
import { Searchbar } from '../_common';
import { NavToggleButton } from '../_common';
import {COLORS, NAV} from "@src/layouts/config-layout.ts";
import NavMini from "@src/layouts/dashboard/nav-mini.tsx";
// ----------------------------------------------------------------------

export default function NavVertical() {
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();

  // Inside the NavVertical component
  const dispatch = useDispatch();
  // @ts-ignore
  const openNav = useSelector((state) => state.drawer.open);

  const handleCloseNav = () => {
    dispatch(closeDrawer());
  };

  // Replace the onCloseNav prop with handleCloseNav
  useEffect(() => {
    if (openNav) {
      handleCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const renderContent = (
    <Scrollbar
      sx={{
        transition: 'all 0.7s ease',
        position: 'relative',
        height: 1,
        backgroundColor: '#2B2D31',
        display:'flex',
        flexDirection:'column',
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Searchbar />

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1}} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            transition: 'all 0.7s ease',
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL + NAV.W_MINI,
            },
          }}
        >
          <Stack direction={'row'} sx={{
            backgroundColor: COLORS.GRAY_LIGHT,
            height: '100%'
          }}>
            <Box sx={{
              width: NAV.W_MINI,
              backgroundColor: COLORS.GRAY_DARK,
            }}>
              <NavMini />
            </Box>
            <Box sx={{
              flex: 1,
              flexGrow: 1,
              width: NAV.W_VERTICAL,
            }}>
              {renderContent}
            </Box>

          </Stack>

        </Drawer>
      )}
    </Box>
  );
}
