// REACT IMPORTS
import React, { useState, useEffect, useContext } from 'react'

// MUI IMPORTS
import { styled, Box, Grid } from "@mui/material";

// LOCAL IMPORTS
import MainLoader from '@/renderer/package/components/MainLoader';
import { Context } from '@/renderer/package/runtime/context'
import Player from "@/renderer/package/components/Player";

// ----------------------------------------------------------------------
// MAIN COMPONENT

export const MoviePlayer = (props) => {
  const context = useContext(Context)
  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    (async () => {
      const connectedDb = context.db.connect(props.cid)
      const movie = await connectedDb.get(props.id)
      setMovie(movie)
      setReady(true);
    })()
  }, [props.id])

  return (
    ready && <MoviePlayerContainer>
      <MoviePlayerWrapper className={'background movie-details'}>
        <Grid sx={{ zIndex: '99', height: '100%', background: '#000' }}>
          <Player movie={{ ...movie.meta, video: movie.video }} onClose={props.onClose} />
        </Grid>
      </MoviePlayerWrapper>
    </MoviePlayerContainer> || <MainLoader />
  )
}

// ----------------------------------------------------------------------
// SUB COMPONENTS

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

// ----------------------------------------------------------------------

export default MoviePlayer
