//REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { styled, Box, Grid } from "@mui/material";
import { Close } from '@mui/icons-material'

// UIX IMPORTS
import { CustomButton } from '@watchitapp/watchitapp-uix';

// PROJECT IMPORTS
import './index.scss';
import Player from "@components/Player/index";
import Gateway from "@helpers/gateway";

export const MoviePlayer = (props) => {
  return (
    <MoviePlayerContainer>
      <MoviePlayerWrapper className={'background movie-details'}>
        <Box sx={{ top: '1.2rem', right: '1.2rem', zIndex: '100', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'} >
          <CustomButton
            variant={'flat'}
            height={"30px"}
            width={"30px"}
            margin='0 0.5rem 0 0'
            icon={<Close style={{ color: '#D1D2D3' }} />}
            onClick={props.onClose}
          />
        </Box>
        <Grid sx={{zIndex: '99', height: '100%', background: '#000'}}>
          <Player movie={{...props.movie, video: `${Gateway.dummyParse(props.movie.video)}/index.m3u8`}} />
        </Grid>
      </MoviePlayerWrapper>
    </MoviePlayerContainer>
  )
}

export default MoviePlayer

export const MoviePlayerContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  zIndex: '97',
  position: 'absolute',
  top: '0',
  left: '0',
  backgroundColor: '#22232a',
  overflow: 'hidden'
}))

export const MoviePlayerWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  zIndex: '10',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  },
  "&::-webkit-scrollbar-thumb": {
    background: 'transparent'
  }
}))
