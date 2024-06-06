//REACT IMPORTS
import React, { useState, useEffect } from 'react'

// MUI IMPORTS
import { styled, Box, Grid, Button } from "@mui/material";
import { Close } from '@mui/icons-material'

// UIX IMPORTS
import { CustomButton } from '@watchitapp/watchitapp-uix';
import { DB as db } from '@main/bridge'

// TABLER IMPORTS
import Plyr from 'plyr-react'

// PROJECT IMPORTS
import './index.scss';
import Image from "@components/Image";
import VideoModal from "@components/VideoModal";
import gateway from '@helpers/gateway'


export const MovieDetails = (props) => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    (async () => {
      const connectedDb = db.connect(props.cid)
      const movies = await connectedDb.get(props.id)
      
      setMovie(movies)
      setReady(true);
    })()
  }, [props.id])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    ready && <MovieDetailsContainer>
      <MovieDetailsWrapper className={'background movie-details'}>
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
        <Grid sx={{ zIndex: '99', height: '100%', background: '#000' }}>
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.3) 90%, rgba(0, 0, 0, 0) 100%)' }} container spacing={2}>
            <Grid
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
              className={'movie__wrapper'}
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pb: 2,
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                }}
              >
                <Grid container spacing={1} sx={{ padding: '1rem 2rem', position: 'relative', width: '100%' }}>
                  <Grid sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem', marginBottom: '0.5rem' }} item xs={12}>
                    <p className="movie__year slide-in-left">{movie?.meta?.genres?.join('  |  ').toUpperCase()}</p>
                  </Grid>
                  <Grid sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }} item xs={12}>
                    <h3 className="movie__name slide-in-top">
                      <span>{movie.meta.title}</span>
                    </h3>
                  </Grid>
                  <Grid
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      padding: '0 1rem',
                      marginTop: '0.5rem',
                      gap: '1rem'
                    }}
                    item
                    xs={12}
                    className={'slide-in-right'}
                  >
                    <p className="movie__year">{movie?.meta?.year}</p>
                    <p className="movie__year">|</p>
                    <p className="movie__year">{movie?.meta?.runtime} min</p>
                    <p className="movie__year">|</p>
                    <p className="movie__year">{movie?.meta?.language?.toUpperCase()}</p>
                    <p className="movie__year">|</p>
                    <p className="movie__year">{movie?.meta?.rating} / 10</p>
                  </Grid>
                  <Grid
                    className="slide-in-left"
                    sx={{
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'center',
                      padding: '0 1rem',
                      maxHeight: '16rem',
                      overflow: 'auto',
                      marginTop: '0.5rem',
                    }}
                    item
                    xs={12}
                  >
                    <p className="movie__text slide-in-left">{movie?.meta?.synopsis}</p>
                  </Grid>
                  <Box
                    className="slide-in-bottom"
                    sx={{
                      display: 'flex',
                      marginTop: '1rem',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      width: { xs: '100%', sm: '75%', md: '50%' },
                    }}
                  >
                    <ButtonTrailer onClick={handleOpen}>Trailer</ButtonTrailer>
                    <GradientBorderButton onClick={() => { props.onPlay(movie) }}>Watch IT</GradientBorderButton>
                  </Box>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  position: 'relative',
                  zIndex: 2,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0',
                  height: '100%',
                }}
                item
                xs={12}
                md={5}
              >
                <figure className="detail__image slide-in-right">
                  <Image src={gateway.parse(movie.images['large'])} preload alt="Short description" />
                </figure>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ top: '-130%', zIndex: '1', left: '-50%', position: 'absolute', height: '170%', pointerEvents: 'none', width: '150%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.6) 22%, rgba(0, 0, 0, 0) 100%)' }}></Box>
          <Box sx={{ top: '0', zIndex: '1', left: '-115%', position: 'absolute', height: '100%', pointerEvents: 'none', width: '175%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.7) 22%, rgba(0, 0, 0, 0) 100%)' }}></Box>
          <Box sx={{ top: '40%', zIndex: '1', left: '-50%', position: 'absolute', height: '170%', pointerEvents: 'none', width: '150%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.6) 22%, rgba(0, 0, 0, 0) 100%)' }}></Box>

          <figure className="background__detail__image">
            <Image src={gateway.parse(movie.images['medium'])} alt="Short description" />
          </figure>
        </Grid>
      </MovieDetailsWrapper>
      <VideoModal videoId={movie?.meta?.trailerUrl} open={open} handleClose={handleClose} />
    </MovieDetailsContainer> || <> </>
  )
}


const MemoizedPlyr = React.memo(
  React.forwardRef((props, ref) => (
    <Plyr ref={ref} {...props} />
  ))
);

export default MovieDetails

const GradientBorderButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: '0.5rem 1.5rem',
  color: theme.palette.common.white,
  backgroundColor: 'transparent',
  fontWeight: 700,
  width: '100%',
  marginTop: '1rem',
  borderRadius: '2rem',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    padding: '2px', // Adjust the padding to control the border width
    background: 'linear-gradient(45deg, rgb(248,244,135), rgb(53,176,182))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'destination-out',
    maskComposite: 'exclude',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ButtonTrailer = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: '0.5rem 1.5rem',
  color: theme.palette.common.white,
  backgroundColor: 'transparent',
  fontWeight: 700,
  width: '100%',
  marginTop: '1rem',
  borderRadius: '2rem',
  border: '2px solid #ff0200',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const MovieDetailsContainer = styled(Box)(() => ({
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
  borderTopLeftRadius: '1rem',
  overflow: 'hidden'
  // border: '1px solid #444'
}))

export const MovieDetailsWrapper = styled(Box)(() => ({
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
