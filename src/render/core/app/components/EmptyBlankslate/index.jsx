import React, { useState } from 'react';
import { styled, Box, TextField, Button, Typography } from '@mui/material';
import NoCollection from '@render/media/img/layout/movies.png';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '50%',
  backgroundColor: '#212328',
  borderRadius: '1rem',
  boxShadow: 24,
  padding: '1rem',
}));

const Index = () => {

  const [cid, setCID] = useState('');
  const handleClick = () => {
    props?.onNewCid(cid)
    setCID("")
  }

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
        Add a new collection.
      </Typography>
      <Typography variant="body1" gutterBottom>
        You can get a collection from the creator profile.
      </Typography>

      <Wrapper>
        <TextField
          value={cid}
          label="Collection CID"
          sx={{ marginY: 2, 'fieldset': { borderColor: '#fff' }, 'label, input': { color: '#fff' } }}
          onChange={(e) => setCID(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleClick} >
          Add Collection
        </Button>
      </Wrapper>
    </Box>
  );
};

export default Index;
