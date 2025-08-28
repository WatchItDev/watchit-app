import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NeonPaper from '@src/sections/publication/components/neon-paper-container';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const SupportBox: FC = () => (
  <Box
    component="a"
    href={GLOBAL_CONSTANTS.OPEN_COLLECTIVE}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      display: 'block',
      textDecoration: 'none',
    }}
  >
    <NeonPaper
      padding="1rem"
      borderRadius="12px"
      animationSpeed="8s"
      sx={{
        opacity: 0.5,
        animation: 'fadeIn 0.2s ease-out',
        transition: 'opacity 0.2s ease-in-out',
        '&:hover': { opacity: 1, backgroundColor: 'green' },
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.5 },
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }}
      >
        Support Watchit <br /> on Open Collective
      </Typography>
    </NeonPaper>
  </Box>
);

export default SupportBox;
