//REACT IMPORTS
import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'

// MUI IMPORTS
import { styled, Box, Typography, Grid } from "@mui/material";
import { Close, VolumeUp, PlayArrow, VolumeOff } from '@mui/icons-material'

// UIX IMPORTS
import { Poster, ProfileInfo, RoundProgress, VideoPlayer, CustomButton } from '@watchitapp/watchitapp-uix';

// TABLER IMPORTS
import { Clock } from "tabler-icons-react";

export const MovieDetails = (props) => {
  const [defaultVolumen, setDefaultVolumen] = useState(0)
  const navigate = useNavigate()

  const item = [
    {
      icon: <RoundProgress size={25} percentage={80} text={'8'} textSize={10} />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    },
    {
      icon: <RoundProgress size={25} percentage={80} text={'8'} textSize={10} />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    },
    {
      icon: <Clock />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    },
    {
      icon: <Clock />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    },
    {
      icon: <Clock />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    },
    {
      icon: <Clock />,
      title: '1h 28m',
      subTitle: 'Duration',
      onClick: () => console.log('clicked profile info')
    }
  ]

  return (
    <MovieDetailsContainer>
      <MovieDetailsWrapper>
        <Box sx={{ top: '1.2rem', zIndex: '2', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'} width={'100%'} >
          <CustomButton
            variant={'flat'}
            height={"30px"}
            width={"30px"}
            margin='0 0.5rem 0 0'
            icon={<><Close style={{ color: '#D1D2D3' }} /></>}
            onClick={props.OnCloseModal}
          />
        </Box>
        <Box sx={{ bottom: '0', zIndex: '1', left: '0', position: 'absolute', height: '66%', width: '100%', background: 'linear-gradient(transparent, #1A1C20 20%)' }}></Box>
        <Box sx={{ top: '0', zIndex: '0', left: '0', position: 'absolute' }} height={'300px'} width={'100%'} >
          <VideoPlayer
            titleMovie="Renfield"
            defaultVolume={defaultVolumen}
            src="http://vjs.zencdn.net/v/oceans.mp4"
            preview={true}
            autoPlay={true}
          />
        </Box>
        <Grid sx={{ zIndex: '99', marginTop: '6rem' }} container spacing={2}>
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5rem' }} item xs={12}>
            <CustomButton
              variant={'flat'}
              height={"30px"}
              width={"30px"}
              icon={<><PlayArrow style={{ color: '#D1D2D3' }} /></>}
              onClick={() => navigate("/player")}
            />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }} width={'100%'} item xs={12}>
            <CustomButton
              variant={'secondary'}
              height={"30px"}
              width={"30px"}
              margin='0 1.2rem 0 0'
              icon={defaultVolumen === 0 ? <><VolumeUp style={{ color: '#D1D2D3' }} /></> : <><VolumeOff style={{ color: '#D1D2D3' }} /></>}
              onClick={() => { defaultVolumen === 0 ? setDefaultVolumen(50) : setDefaultVolumen(0) }}
            />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', padding: '0' }} item xs={3}>
            <Poster
              img={'https://cuevana33.com/wp-content/uploads/2024/01/7IqJaCVN0xkLWnI79EguVtwgfXf-185x278.jpg'}
              title={'Renfield'}
              progress={50}
              year={2022}
              canHover={true}
              size={{
                height: '100% !important'
              }}
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={1}>
              <Grid sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }} item xs={12}>
                <MovieText color={'#ffffff'} fontSize={'40px'} fontWeight={'bold'}>Renfield</MovieText>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }} item xs={12}>
                <MovieText color={'#D1D2D3'} fontSize={'20px'} fontWeight={'regular'}>Thiller - Terror</MovieText>
                <MovieText color={'#ffffff'} fontSize={'20px'} fontWeight={'bold'}>2019</MovieText>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '0 1rem' }} item xs={12}>
                <MovieText sx={{ textAlign: 'justify' }} color={'#D1D2D3'} fontSize={'16px'} fontWeight={'regular'}>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Laudantium incidunt dolorum dolor suscipit debitis. Quisquam
                  vitae fuga temporibus tempore consectetur, ab voluptates! Quod
                  deserunt voluptates reprehenderit possimus enim placeat officiis.
                </MovieText>
              </Grid>
              <Grid sx={{ padding: '0 1rem' }} item xs={12}>
                <Grid sx={{/* transform: 'rotate(180deg)',overflowY:'scroll',width:'100%',display:'flex' */ }} container spacing={2}>
                  {item.map((x, i) => {
                    return (
                      <Grid sx={{/* display:'flex',transform: 'rotate(-180deg)',display:'flex' */ }} item xs={2} key={i} >
                        <ProfileInfo
                          icon={x.icon}
                          title={x.title}
                          subTitle={x.subTitle}
                          onClick={x.onClick}>
                        </ProfileInfo>
                      </Grid>

                    )
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <hr style={{ borderTop: '1px solid rgb(241, 238, 239, 0.2)', width: 'calc(100% - 3rem)', marginTop: '3rem' }} />

          <Grid display={'flex'} sx={{ alignItems: 'center', justifyContent: 'center' }} item xs={12}>
            <Box display={'flex'} sx={{ width: 'calc(100% - 2rem)', alignItems: 'center', justifyContent: 'center' }}>
              {/*<ControllerSlider movies={movies} title='More titles like this' />*/}
            </Box>
          </Grid>
        </Grid>
      </MovieDetailsWrapper>
    </MovieDetailsContainer>
  )
}

export default MovieDetails

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
  backgroundColor: 'rgb(0,0,0,0.43)'
}))

export const MovieDetailsWrapper = styled(Box)(() => ({
  display: 'flex',
  height: 'calc(100% - 3rem)',
  // maxHeight: '910px',
  maxHeight: '570px',
  width: '848px',
  zIndex: '10',
  borderRadius: '10px',
  position: 'relative',
  overflowX: 'auto',
  backgroundColor: '#1A1C20',
  '&::-webkit-scrollbar': {
    width: '0',
    background: 'transparent '
  },
  "&::-webkit-scrollbar-thumb": {
    background: '#FF0000'
  }
}))

export const MovieText = styled(Typography)((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  color: props.color,
  margin: props.margin
}))

