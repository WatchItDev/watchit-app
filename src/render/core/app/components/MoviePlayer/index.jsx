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
        <Grid sx={{zIndex: '99', height: '100%', background: '#000'}}>
          <Player movie={{...props.movie, video: `${Gateway.dummyParse(props.movie.video)}/index.m3u8`}} onClose={props.onClose} />
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
