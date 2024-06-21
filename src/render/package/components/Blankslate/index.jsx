import React, { useState } from 'react';
import { styled, Box, TextField, Typography, Divider } from '@mui/material';
import CustomButton from "@/render/package/components/CustomButton";
import ChannelItem from '@/render/package/components/ChannelItem';
import CustomScrollbars from "@/render/package/components/Scroller";
import Footer from '@/render/package/components/Footer'
import settings from '@/render/settings'

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
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
      <Typography variant="h4" color={'#eee'} gutterBottom>
        New collection.
      </Typography>
      <Typography variant="body1" color={'#eee'} gutterBottom>
        Find the collection CID in the creator's profile.
      </Typography>

      <Wrapper>
        <TextField
          fullWidth
          value={cid}
          label="Collection CID"
          onChange={(e) => setCID(e.target.value)}
          sx={{
            marginY: 2,
            fieldset: {
              borderColor: '#eee !important'
            },
            'label,input': {
              color: '#eee !important',
            }
          }}
        />
        <CustomButton
          variant={'filled'}
          onClick={handleClick}
          width='100%'
          padding={'8px 16px'}
        >
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
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '50%', opacity: 0.4, overflow: 'hidden' }}>
          <Divider orientation="vertical" sx={{ height: '100%', mx: 2, borderColor: '#eee' }} />
          <Typography variant="body1" color={'#eee'} gutterBottom>
            or
          </Typography>
          <Divider orientation="vertical" sx={{ height: '100%', mx: 2, borderColor: '#eee' }} />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" width="60%">
          <Blankslate onButtonClick={props.onButtonClick} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default React.memo(EmptyPage);
