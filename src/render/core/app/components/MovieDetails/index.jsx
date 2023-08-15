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
  CustomButton,
  Button
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
            icon={<><Close /></>}
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

        <Grid 
          container spacing={2} 
          sx={{ zIndex: '99', marginTop: '8rem' }}>
          <Grid 
            item xs={12}
            display='flex' alignItems='center'
            justifyContent='center' sx={{ marginBottom: '3rem' }}
          >
            <CustomButton
              variant='flat'
              height='40px'
              width='40px'
              icon={<><PlayArrow /></>}
              onClick={() => history.push('/player')}
            />
          </Grid>

          <CustomGridVolumen
            item xs={12}
            display='flex' alignItems='center'
            justifyContent='end' width='100%'
          >
            <CustomButton
              variant='secondary'
              height='40px'
              width='40px'
              margin='0 1.2rem 0 0'
              icon={
                defaultVolume === 0
                  ? <VolumeUp />
                  : <VolumeOff />
              }
              onClick={() => handleVolumePreview()}
            />
          </CustomGridVolumen>

          <Grid
            item xs={12} sm={3}
            display='flex' alignItems='center'
            justifyContent='end' sx={{ paddingTop: '0 !important' }}
          >
            <CustomGridPoster 
              item xs={6} sm={12} 
              display='flex' justifyContent='center' 
              height='100%' sx={{ paddingTop: '0 !important' }} 
            >
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
            </CustomGridPoster>

            <CustomGrid item xs={6} sm={12}>
              <Box 
                display='flex' justifyContent='space-between' 
                sx={{ width: 'calc(100% - 4rem)' }}
              >
                <Button
                  variant='secondary'
                  children={<span>Play</span>}
                  icon={<PlayArrow />}
                  onClick={() => history.push('/player')}
                />
                <CustomButton
                  variant='secondary'
                  height='40px'
                  width='40px'
                  icon={
                    defaultVolume === 0
                      ? <VolumeUp />
                      : <VolumeOff />
                  }
                  onClick={() => handleVolumePreview()}
                />
              </Box>
              <MobileTitleWrapper>
                <Typography variant='subtitle1'>Thiller - Terror</Typography>
                <Typography variant='subtitle1'>2019</Typography>
              </MobileTitleWrapper>
            </CustomGrid>

          </Grid>

          <Grid item xs={12} sm={9} sx={{ padding:'0 !important' }}>
            <Grid 
              container spacing={0} 
              display='flex' alignItems='start'
            >
              <Grid 
                item xs={12}
                display='flex' alignItems='center' 
                sx={{ padding: '0 1rem', margin:'0px 0' }} 
              >
                <Typography variant='h1'>Renfield</Typography>
              </Grid>

              <CustomGrid2 item xs={12}>
                <Typography variant='subtitle1'>Thiller - Terror</Typography>
                <Typography variant='subtitle1'>2019</Typography>
              </CustomGrid2>

              <Grid 
                item xs={12} 
                display='flex' alignItems='center' 
                justifyContent='start' sx={{  padding: '0 1rem',margin:'8px 0'  }} 
              >
                <Typography variant='subtitle2' align='justify'>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Laudantium incidunt dolorum dolor suscipit debitis. Quisquam
                  vitae fuga temporibus tempore consectetur, ab voluptates! Quod
                  deserunt voluptates reprehenderit possimus enim placeat officiis.
                </Typography>
              </Grid>

              <Grid sx={{ padding: '0 1rem',margin:'7px 0' }} item xs={12}>
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

const CustomGridPoster = styled(Grid)(({ theme }) => ({
  //padding: '0 1rem',
  //display: 'none',
  //flexDirection: 'column',
  //alignItems: 'center',
  //justifyContent: 'end',
  //height: '100%',
  [theme.breakpoints.only('xs')]: {
    justifyContent: 'start'
  }
}))


const CustomGrid = styled(Grid)(({ theme }) => ({
  padding: '0 1rem',
  display: 'none',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'end',
  height: '100%',
  [theme.breakpoints.only('xs')]: {
    display: 'flex',
    "&button":{
      margin:'8px 0'
    }
  }
}))

const CustomGridVolumen = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.only('xs')]: {
    display: 'none',
  }
}))

const CustomGrid2 = styled(Grid)(({ theme, props }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1rem',
  margin: '10px 0',
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
  width: 'calc(100% - 4rem)',
  'span':{
    margin:'8px 0'
  }
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
