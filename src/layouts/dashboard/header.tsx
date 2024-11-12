// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { FC, PropsWithChildren } from 'react';
import { HEADER } from '../config-layout';

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
        <Box sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            { children }
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            { actions }
          </Box>
        </Box>
      </Toolbar>

      {/* <HeaderShadow /> */}
    </>
  );
}

export default Header
