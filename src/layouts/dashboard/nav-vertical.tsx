// REACT IMPORTS
import { useState, useEffect } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

// COMPONENTS IMPORTS
import Scrollbar from '@src/components/scrollbar';
import { NavSectionVertical } from '@src/components/nav-section';
import { LoginModal } from '@src/components/loginModal';

// HOOKS IMPORTS
import { useResponsive } from '@src/hooks/use-responsive';
import { usePathname } from '@src/routes/hooks';
import { useAuth } from '@src/hooks/use-auth'
import { useNavData } from './config-navigation';

// LAYOUT IMPORTS
import { NAV } from '../config-layout';
import { AccountPopover, NotificationsPopover, Searchbar } from '../_common';
// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
  sidebarWidth: number;
};

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav, sidebarWidth}: Props) {
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();
  const { authenticated, loading } = useAuth(); // Use the AuthProvider to check authentication
  const [loginModalOpen, setLoginModalOpen] = useState(false); // State to control LoginModal visibility


  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };


  const renderContent = (
    <Scrollbar
      sx={{
        transition: 'all 0.7s ease',
        position: 'relative',
        width: sidebarWidth,
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
      {/*Add a icon to make collapsible the sidebar*/}


      <Searchbar />

      <NavSectionVertical
        size={sidebarWidth === NAV.W_MINI ? 'collapsed' : 'full'}
        data={navData}
        config={{
          currentRole: 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: '12px 16px 8px 16px',
          backgroundColor: '#232428',
          position: 'sticky',
          bottom: '0',
          width: '100%'
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        ) : undefined}

        {authenticated && !loading ? (
          <AccountPopover />
        ) : undefined}

        {!authenticated && !loading ? (
          <Button variant="contained" onClick={handleOpenModal}>
            Login
          </Button>
        ) : undefined}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <NotificationsPopover />
        </Box>
      </Stack>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: sidebarWidth },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            transition: 'all 0.7s ease',
            height: 1,
            position: 'fixed',
            width: sidebarWidth,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: sidebarWidth,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      <LoginModal open={loginModalOpen} onClose={handleCloseModal} />
    </Box>
  );
}
