// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
//
import Main from './main';
// import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import {useState} from "react";
import {NAV} from "@src/layouts/config-layout.ts";
import Stack from "@mui/material/Stack";
import {
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const nav = useBoolean();
  const [sidebarWidth, setSidebarWidth ] = useState(NAV.W_VERTICAL); // State to control LoginModal visibility
  const [triggerPosition, setTriggerPosition ] = useState(NAV.W_MINI + NAV.W_VERTICAL ); // State to control LoginModal visibility
  const toggleSidebarWidth = () => {
    if (sidebarWidth === NAV.W_VERTICAL) {
      setSidebarWidth(NAV.W_MINI);
      setTriggerPosition(NAV.W_MINI *2 - 1);
    } else {
      setSidebarWidth(NAV.W_VERTICAL);
      setTriggerPosition(NAV.W_MINI + NAV.W_VERTICAL - 1);
    }
  };
  return (
    <>
      {/* <Header onOpenNav={nav.onTrue} /> */}

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{
          borderTopRightRadius: '10px',
          borderBottomRightRadius: '10px',
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          transition: 'all 0.7s ease',
          position: 'fixed',
          top: '7px',
          left: triggerPosition,
          cursor: 'pointer',
          zIndex: 20,
        }}>
          <Stack
            style={{margin: 0, padding: '7px 1px'}}
            direction="row"
            justifyContent="flex-end"
            sx={{
              backgroundColor: '#2B2D31',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px'
            }}
          >
            <Box sx={{display: 'flex'}} onClick={toggleSidebarWidth}>
              {
                sidebarWidth === NAV.W_VERTICAL ? (
                  <IconChevronLeft />
                ) : (
                  <IconChevronRight />)
              }
            </Box>
          </Stack>
        </Box>
        <NavMini />
        <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} sidebarWidth={sidebarWidth} />
        <Main>{children}</Main>
      </Box>
    </>
  );
}
