import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function AvatarShape({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width={144}
      height={62}
      fill="none"
      viewBox="0 0 144 62"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        color: 'background.paper',
        ...sx,
      }}
      {...other}
    >
      <path
        d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Box>
  );
}

export default memo(AvatarShape);
