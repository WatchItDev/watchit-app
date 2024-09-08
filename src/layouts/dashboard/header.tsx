// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
// theme
import { bgBlur } from 'src/theme/css';
//
import { FC, PropsWithChildren } from 'react';
import { HEADER } from '../config-layout';
//
import {  HeaderShadow } from '../_common';

// ----------------------------------------------------------------------

interface HeaderProps {
  actions?: React.ReactNode
}

// ----------------------------------------------------------------------

const Header: FC<PropsWithChildren<HeaderProps>> = ({ children ,actions }) =>  {
  const theme = useTheme();

  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          minHeight: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          borderBottom: `dashed 1px ${theme.palette.divider}`,
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          // ...bgBlur({
          //   color: theme.palette.background.default,
          // })
          backgroundColor: '#2B2D31',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            { children }
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            { actions }
          </Box>
        </Container>
      </Toolbar>

      {/* <HeaderShadow /> */}
    </>
  );
}

export default Header
