// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from '@src/hooks/use-responsive';
// components
// import { useSettingsContext } from '@src/components/settings';
//
// import { HEADER, NAV } from '../config-layout';

// ----------------------------------------------------------------------

// const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const lgUp = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        padding: '0px 5px',
        transition: 'all 0.7s ease',
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1E1F22',
        // py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          // px: 2,
          // py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - 368px)`
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
