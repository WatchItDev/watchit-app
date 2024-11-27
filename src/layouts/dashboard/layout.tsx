// @mui
import Box from '@mui/material/Box';
// hooks
import { useResponsive } from '@src/hooks/use-responsive';
//
import Main from './main';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavVerticalMini from "@src/layouts/dashboard/nav-vertical-mini";

import { useSelector, useDispatch } from 'react-redux';
import {toggleMinibar, removeMinibar} from '@redux/minibar';
import { useEffect } from 'react';

// ----------------------------------------------------------------------
type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const dispatch = useDispatch();
  // @ts-ignore
  const minibarState = useSelector((state) => state.minibar.state);
  // @ts-ignore
  const wasCollapse = useSelector((state) => state.minibar.wasCollapsed);

  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (lgUp && !wasCollapse) {
      dispatch(removeMinibar());
    } else if (!lgUp && minibarState !== 'vertical') {
      dispatch(toggleMinibar());
    }

  }, [lgUp, minibarState, dispatch]);

  const renderNavMini = <><NavMini /> <NavVerticalMini /></>;
  const renderNavVertical = <><NavMini /><NavVertical /></>;

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
    <Box
      sx={{
        minHeight: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {lgUp ? renderNavVertical : (
        <NavVertical />
      )}
      <Main>{children}</Main>
    </Box>
  );
}
