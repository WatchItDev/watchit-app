import { Box, Typography } from '@mui/material';

export function PublicationHidden() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        sx={{
          height: '20rem',
          textAlign: 'center',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          background: '#2b2d31',
          borderRadius: '1rem',
        }}
      >
        Publication is hidden
      </Typography>
    </Box>
  );
}
