// REACT IMPORTS
import React, { useState } from 'react'

// MUI IMPORTS
import { styled, Box, Typography } from '@mui/material'
import { Close, VolumeUp, PlayArrow, VolumeOff } from '@mui/icons-material'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'

// WATCHIT_UIX PACKAGE IMPORTS
import {
  Poster,
  ProfileInfo,
  ControllerSlider,
  VideoPlayer,
  CustomButton
} from '@zorrillosdev/watchit_uix'

// REACT ROUTER IMPORT
import { useHistory } from 'react-router-dom'

// TEST DATA IMPORTS
import { movies, profileInfoList } from '../../TempData'

// ===========================||  MOVIE DETAILS - MODAL ||=========================== //

export const MovieDetails = (props) => {
  const [defaultVolume, setDefaultVolume] = useState(0)
  const history = useHistory()

  const handleVolumePreview = () => {
    defaultVolume === 0
      ? setDefaultVolume(50)
      : setDefaultVolume(0)
  }

  return (
    <CustomModal open={props.open} onClose={props.handleOnCloseModal}>
      <MovieDetailsWrapper>
        <CloseButtonWrapper>
          <CustomButton
            variant='flat'
            height='40px'
            width='40px'
            margin='0 1.2rem 0 0'
            icon={<><Close style={{ color: '#D1D2D3' }} /></>}
            onClick={props.handleOnCloseModal}
          />
        </CloseButtonWrapper>

        <BackgroundBlur />

        <VideoPlayerWrapper>
          <VideoPlayer
            titleMovie='Renfield'
            defaultVolume={defaultVolume}
            src='http://vjs.zencdn.net/v/oceans.mp4'
            preview
            autoPlay
          />
        </VideoPlayerWrapper>

        <Grid sx={{ zIndex: '99', marginTop: '5rem' }} container spacing={2}>
          <Grid 
            item xs={12}
            display='flex' alignItems='center'
            justifyContent='center' sx={{ marginBottom: '5rem' }}
          >
            <CustomButton
              variant='flat'
              height='40px'
              width='40px'
              icon={<><PlayArrow style={{ color: '#D1D2D3' }} /></>}
              onClick={() => history.push('/player')}
            />
          </Grid>

          <Grid
            display='flex' alignItems='center'
            justifyContent='end' width='100%'
            item xs={12}
          >
            <CustomButton
              variant='secondary'
              height='40px'
              width='40px'
              margin='0 1.2rem 0 0'
              icon={
                defaultVolume === 0
                  ? <VolumeUp style={{ color: '#D1D2D3' }} />
                  : <VolumeOff style={{ color: '#D1D2D3' }} />
              }
              onClick={() => handleVolumePreview()}
            />
          </Grid>

          <Grid
            item xs={12} sm={3}
            display='flex' alignItems='center'
            justifyContent='end' sx={{ padding: '0' }}
          >
            <Grid display='flex' justifyContent='center' height='100%' item xs={6} sm={12}>
              <Poster
                img={movies[0].img}
                title='Renfield'
                progress={50}
                year={2022}
                canHover
                size={{
                  height: '100% !important'
                }}
              />
            </Grid>

            <CustomGrid item xs={6} sm={12}>
              <Box 
                display='flex' justifyContent='space-between' 
                sx={{ width: 'calc(100% - 4rem)' }}
              >
                <CustomButton
                  variant='secondary'
                  height='30px'
                  width='30px'
                  children={<span>Play</span>}
                  icon={<PlayArrow style={{ color: '#D1D2D3' }} />}
                  onClick={() => history.push('/player')}
                />
                <CustomButton
                  variant='secondary'
                  height='30px'
                  width='30px'
                  icon={
                    defaultVolume === 0
                      ? <VolumeUp style={{ color: '#D1D2D3' }} />
                      : <VolumeOff style={{ color: '#D1D2D3' }} />
                  }
                  onClick={() => handleVolumePreview()}
                />
              </Box>
              <MobileTitleWrapper>
                <MovieText color='#D1D2D3' fontSize='20px' fontWeight='regular'>Thiller - Terror</MovieText>
                <MovieText color='#ffffff' fontSize='20px' fontWeight='bold'>2019</MovieText>
              </MobileTitleWrapper>
            </CustomGrid>

          </Grid>

          <Grid item xs={12} sm={9}>
            <Grid 
              container spacing={1} 
              display='flex' alignItems='start'
            >

              <Grid sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }} item xs={12}>
                <MovieText color='#ffffff' fontSize='40px' fontWeight='bold'>Renfield</MovieText>
              </Grid>

              <CustomGrid2 item xs={12}>
                <MovieText color='#D1D2D3' fontSize='20px' fontWeight='regular'>Thiller - Terror</MovieText>
                <MovieText color='#ffffff' fontSize='20px' fontWeight='bold'>2019</MovieText>
              </CustomGrid2>

              <Grid 
                item xs={12} 
                display='flex' alignItems='center' 
                justifyContent='start' sx={{  padding: '0 1rem' }} 
              >
                <MovieText sx={{ textAlign: 'justify' }} color='#D1D2D3' fontSize='16px' fontWeight='regular'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Laudantium incidunt dolorum dolor suscipit debitis. Quisquam
                  vitae fuga temporibus tempore consectetur, ab voluptates! Quod
                  deserunt voluptates reprehenderit possimus enim placeat officiis.
                </MovieText>
              </Grid>

              <Grid sx={{ padding: '0 1rem' }} item xs={12}>
                <Grid container spacing={2}>
                  {profileInfoList.map((profile, index) => {
                    return (
                      <Grid key={index} item xs={2}>
                        <ProfileInfo
                          icon={profile.icon}
                          title={profile.title}
                          subTitle={profile.subTitle}
                          onClick={profile.handelOnClick}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid 
            item xs={12} 
            display='flex' alignItems='center'
            justifyContent='center' sx={{ pading: '0' }}
          >
            <hr style={{ borderTop: '1px solid rgb(241, 238, 239, 0.2)', width: '100%', opacity: '0.1' }} />
          </Grid>

          <Grid 
            item xs={12} 
            display='flex' alignItems='center' 
            justifyContent='center' 
          >
            <SliderMovieWrapper>
              <ControllerSlider movies={movies} title='More titles like this' />
            </SliderMovieWrapper>
          </Grid>

        </Grid>
      </MovieDetailsWrapper>
    </CustomModal>
  )
}

export const MovieDetailsWrapper = styled(Box)(() => ({
  display: 'flex',
  height: 'calc(100% - 3rem)',
  padding: '0 1rem',
  maxHeight: '910px',
  width: '848px',
  zIndex: '10',
  border: 'none',
  outlineColor: 'transparent',
  outline: 'none',
  borderRadius: '10px',
  position: 'relative',
  overflowX: 'auto',
  backgroundColor: '#1A1C20',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#FF0000'
  }
}))

export const MovieText = styled(Typography)((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  color: props.color,
  margin: props.margin
}))

const CustomGrid = styled(Grid)(({ theme }) => ({
  padding: '0 1rem',
  display: 'none',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'end',
  height: '100%',
  [theme.breakpoints.only('xs')]: {
    display: 'flex'
  }
}))

const CustomGrid2 = styled(Grid)(({ theme, props }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1rem',
  [theme.breakpoints.only('xs')]: {
    display: 'none'
  }
}))

export const BackgroundBlur = styled(Box)(() => ({
  bottom: '0',
  zIndex: '1',
  left: '0',
  position: 'absolute',
  height: 'calc(100% - 320px)',
  width: '100%',
  background: 'linear-gradient(transparent, #1A1C20 13%)'
}))

export const CloseButtonWrapper = styled(Box)(() => ({
  top: '1.2rem',
  zIndex: '2',
  left: '0',
  padding: '0 1rem',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'end',
  height: '30px',
  width: '100%'
}))

export const VideoPlayerWrapper = styled(Box)(() => ({
  top: '0',
  zIndex: '0',
  left: '0',
  position: 'absolute',
  height: '360px',
  width: '100%'
}))

export const MobileTitleWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '4rem',
  flexDirection: 'column',
  textAlign: 'end',
  width: 'calc(100% - 4rem)'
}))

export const CustomModal = styled(Modal)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none'
}))

export const SliderMovieWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem'
}))

export default MovieDetails
