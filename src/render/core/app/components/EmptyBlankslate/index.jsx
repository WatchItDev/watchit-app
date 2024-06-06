import React from 'react';
import { Typography, Box } from '@mui/material';
import NoCollection from '@render/media/img/layout/movies.png';

const Index = () => {
  return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="calc(100% - 6rem)"
      >
        <Box display="flex" alignItems="center" mb={4}>
          <Box
              component="img"
              src={NoCollection}
              alt="No Collection"
              width="20rem"
          />
        </Box>
        <Typography variant="h4" gutterBottom>
          There is no collection added
        </Typography>
        <Typography variant="body1" gutterBottom>
          You can add a collection by clicking the "+" button
        </Typography>
      </Box>
  );
};

export default Index;
