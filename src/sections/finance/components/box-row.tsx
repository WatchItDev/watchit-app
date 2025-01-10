import { FC, PropsWithChildren } from 'react';

import Box from '@mui/material/Box';

export const BoxRow: FC<PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      my: 0.5
    }}
  >
    {children}
  </Box>
);

export default BoxRow;
