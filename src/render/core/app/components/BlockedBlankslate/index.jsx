import React from 'react';
import { styled, Box, Typography } from '@mui/material';
import Blocked from '@render/media/img/layout/blocked.png';

const BlockedBlankslate = () => {
  return (
      <Blocker >
        <Box display="flex" flexDirection={'column'} width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'} sx={{ maxWidth: '600px' }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Box component="img" src={Blocked} alt="blocked" width="20rem" />
          </Box>
          <Typography variant="h4" sx={{ opacity: 0.7 }}>Sorry, Watchit is not available on mobile or small screens yet.</Typography>
          <Typography variant="body1" sx={{ mt: 4, opacity: 0.5 }}>Support for this device or screen size is coming soon.</Typography>
        </Box>
      </Blocker>
  );
};

const Blocker = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  backgroundColor: '#1A1C20',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem'
}));

export default BlockedBlankslate;
