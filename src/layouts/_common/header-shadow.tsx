// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function HeaderShadow({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        m: 'auto',
        height: 24,
        zIndex: -1,
        opacity: 0.48,
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
