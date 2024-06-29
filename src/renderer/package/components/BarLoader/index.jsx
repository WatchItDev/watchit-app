// REACT IMPORTS
import React from 'react';

// MUI IMPORTS
import { Box, Typography, LinearProgress, styled } from '@mui/material';

// ----------------------------------------------------------------------
// MAIN COMPONENT

const BarLoader = ({ showText, stateText, statePercent }) => {
  return (
      <BarLoaderWrapper>
        <TextDisplay text={stateText} />
        {statePercent > 0 && <ProgressBar value={statePercent} />}
        {statePercent > 0 && showText && <PercentageText value={statePercent} />}
      </BarLoaderWrapper>
  );
};

// ----------------------------------------------------------------------
// SUB COMPONENTS

const TextDisplay = ({ text }) => (
    <Box>
      <Typography
          variant="h3"
          sx={{ margin: '0 0 1rem 0', opacity: 0.5, color: 'white' }}
      >
        {text}
      </Typography>
    </Box>
);

const ProgressBar = ({ value }) => (
    <Box position="absolute" width="100%">
      <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FF8F00',
            },
          }}
      />
    </Box>
);

const PercentageText = ({ value }) => (
    <Box position="relative" top="10px">
      <Typography
          variant="h3"
          sx={{ margin: '2.5rem 0 0 0', opacity: 0.5, color: 'white' }}
      >
        {value}%
      </Typography>
    </Box>
);

const BarLoaderWrapper = styled(Box)(() => ({
  position: 'absolute',
  bottom: '30%',
  width: '100%',
  zIndex: 2,
  textAlign: 'center',
}));

// ----------------------------------------------------------------------

export default BarLoader;
