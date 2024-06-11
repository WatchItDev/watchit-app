import React, { useState } from 'react';
import { styled, Box, TextField, Typography, Divider } from '@mui/material';
import NoCollection from '@render/media/img/layout/movies.png';
import CustomButton from "@components/CustomButton";
import ChannelItem from '@components/ChannelItem';
import CustomScrollbars from "@components/Scroller";
import settings from '@settings'

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '25rem',
  backgroundColor: '#212328',
  borderRadius: '1rem',
  boxShadow: 24,
  padding: '0 1rem',
  margin: 0,
  opacity: 0.8
}));

const Collections = (props) => {
  const handleChannelItemClick = (cid) => {
    props?.onButtonClick(cid)
  };

  return (
  <>
    <Typography variant="h4" color={'#D1D2D3'} gutterBottom>
      Collections
    </Typography>
    <Typography variant="body1" color={'#D1D2D3'} gutterBottom>
      Click to any collection below to start synchronization.
    </Typography>
    <CustomScrollbars
      autoHide
      autoHeight
      autoHeightMax={500}
      autoHideTimeout={1000}
      autoHideDuration={200}
      thumbMinSize={20}
      universal
    >
      <Box display="flex" flexWrap={'wrap'} alignItems={'center'} justifyContent={'center'}>
        {settings.featuredCollections.map((collection) => (
          <Box key={collection.cid} display="flex" alignItems={'center'} justifyContent={'center'} width={'33%'} mb={4}>
            <ChannelItem
              label={collection.label}
              innerLetter={collection.cid}
              onClick={() => handleChannelItemClick(collection.cid)}
            />
          </Box>
        ))}
      </Box>
    </CustomScrollbars>
  </>
  )
}

const Blankslate = (props) => {
  const [cid, setCID] = useState('');
  const handleClick = () => {
    if (!cid) return;
    props?.onButtonClick(cid);
    setCID("");
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
      <Typography variant="h4" color={'#D1D2D3'} gutterBottom>
        Add a new collection.
      </Typography>
      <Typography variant="body1" color={'#D1D2D3'} gutterBottom>
        You can find a collection cid in the creator profile.
      </Typography>

      <Wrapper>
        <TextField
          value={cid}
          label="Collection CID"
          sx={{ marginY: 2, 'fieldset': { borderColor: '#fff !important' }, 'label, input': { color: '#fff !important' } }}
          onChange={(e) => setCID(e.target.value)}
          fullWidth
        />
        <CustomButton variant={'filled'} onClick={handleClick} padding={'8px 16px'}>
          Connect
        </CustomButton>
      </Wrapper>
    </Box>
  );
};

const EmptyPage = (props) => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box display="flex" width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'} sx={{ maxWidth: '1200px' }}>
        <Box display="flex" flexDirection="column" width="40%" alignItems={'center'} justifyContent={'center'}>
          <Collections onButtonClick={props.onButtonClick} />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" width="60%">
          <Blankslate onButtonClick={props.onButtonClick} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(EmptyPage);
