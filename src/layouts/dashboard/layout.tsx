// @mui
import Box from '@mui/material/Box';
// hooks
import { useResponsive } from '@src/hooks/use-responsive';
//
import Main from './main';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavVerticalMini from '@src/layouts/dashboard/nav-vertical-mini';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMinibar, removeMinibar } from '@redux/minibar';
import { useEffect } from 'react';

// Get the version from package.json
import { version } from '../../../package.json';
// ----------------------------------------------------------------------
interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const dispatch = useDispatch();
  // @ts-expect-error No error in this context
  const minibarState = useSelector((state) => state.minibar.state);
  // @ts-expect-error No error in this context
  const wasCollapse = useSelector((state) => state.minibar.wasCollapsed);

  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (lgUp && !wasCollapse) {
      dispatch(removeMinibar());
    } else if (!lgUp && minibarState !== 'vertical') {
      dispatch(toggleMinibar());
    }
  }, [lgUp, minibarState, dispatch, wasCollapse]);

  const renderNavMini = (
    <>
      <NavMini /> <NavVerticalMini />
    </>
  );
  const renderNavVertical = (
    <>
      <NavMini />
      <NavVertical />
    </>
  );

  if (minibarState === 'mini') {
    return (
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
        {lgUp ? renderNavVertical : <NavVertical />}
        <Main>{children}</Main>
      </Box>
      {/* Static footer to show version */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          padding: '3px 10px',
          color: 'text.secondary',
          fontSize: '0.8rem',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          borderRadius: '8px 0 0 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {`v${version}`}
      </Box>
    </>
  );
}
