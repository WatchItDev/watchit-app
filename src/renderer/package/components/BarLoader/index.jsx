import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, LinearProgress } from '@mui/material';

const BarLoader = ({ showText, stateText, statePercent }) => {
  return (
      <Box
          position="absolute"
          bottom="30%"
          width="100%"
          zIndex={2}
          textAlign="center"
      >
        <Box>
          <Typography
              variant="h3"
              sx={{ margin: '0 0 1rem 0', opacity: 0.5, color: 'white' }}
          >
            {stateText}
          </Typography>
        </Box>
        {statePercent > 0 && (
            <Box position="absolute" width="100%">
              <LinearProgress
                  variant="determinate"
                  value={statePercent}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#FF8F00',
                    },
                  }}
              />
            </Box>
        )}
        {statePercent > 0 && showText && (
            <Box position="relative" top="10px">
              <Typography
                  variant="h3"
                  sx={{ margin: '2.5rem 0 0 0', opacity: 0.5, color: 'white' }}
              >
                {statePercent}%
              </Typography>
            </Box>
        )}
      </Box>
  );
};

BarLoader.propTypes = {
  showText: PropTypes.bool,
  stateText: PropTypes.string,
  statePercent: PropTypes.number.isRequired,
};

export default BarLoader;
