//REACT IMPORTS
import React, { useRef, useState } from 'react'
import { useNavigate} from 'react-router-dom'

// MUI IMPORTS
import { styled, Box, Typography, Grid } from "@mui/material";
import { Close, VolumeUp, PlayArrow, VolumeOff } from '@mui/icons-material'

// UIX IMPORTS
import { Poster, ProfileInfo, RoundProgress, CustomButton } from '@watchitapp/watchitapp-uix';

// TABLER IMPORTS
import { Clock } from "tabler-icons-react";
import gatewayHelper from "@helpers/gateway";
import Plyr from 'plyr-react'

export const MovieDetails = (props) => {
  const [muted, setMuted] = useState(false)
  const navigate = useNavigate()
  const player = useRef()

  const item = [
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
    }
  ]

  const onMute = async () => {
    console.log('on mute');
    if (!player.current.plyr.source) return;

    player.current.plyr.volume === 0 ? player.current.plyr.increaseVolume(1)
        : player.current.plyr.decreaseVolume(1)

    setMuted(player.current.plyr.volume === 0)
  }

  // console.log('details')
  // console.log(props.movie.meta)
  // console.log(props.movie.meta.trailerUrl)
  // console.log(player.current?.plyr?.volume)

  return (
    <MovieDetailsContainer>
      <MovieDetailsBackdrop onClick={props.OnCloseModal} />
      <MovieDetailsWrapper>
        <Box sx={{ top: '1.2rem', right: '1.2rem', zIndex: '2', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'} >
          <CustomButton
            variant={'flat'}
            height={"30px"}
            width={"30px"}
            margin='0 0.5rem 0 0'
            icon={<Close style={{ color: '#D1D2D3' }} />}
            onClick={props.OnCloseModal}
          />
        </Box>
        <Box sx={{ top: '15rem', right: '0.2rem', zIndex: '2', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'} >
          <CustomButton
              variant={'secondary'}
              height={"30px"}
              width={"30px"}
              margin='0 1.2rem 0 0'
              icon={muted ? <VolumeOff style={{ color: '#D1D2D3' }} /> : <VolumeUp style={{ color: '#D1D2D3' }} />}
              onClick={onMute}
          />
        </Box>
        <Box sx={{ top: '15rem', right: '4.2rem', zIndex: '2', left: '0', position: 'absolute', display: 'flex', justifyContent: 'end' }} height={'30px'} >
          <CustomButton
              variant={'secondary'}
              height={"30px"}
              width={"30px"}
              icon={<PlayArrow style={{ color: '#D1D2D3' }} />}
              onClick={() => navigate("/player")}
          />
        </Box>
        <Box sx={{ bottom: '0', zIndex: '1', left: '0', position: 'absolute', height: '60%', pointerEvents: 'none', width: '100%', background: 'linear-gradient(transparent, #1A1C20 20%)' }}></Box>
        <Box sx={{zIndex: '0'}} height={'300px'} width={'100%'}>
          <MemoizedPlyr
              ref={player}
              autoPlay={true}
              onPlaying={() => { console.log('playing')}}
              onPlay={() => { console.log('play')}}
              onPause={() => { console.log('pause')}}
              onError={(e) => { console.log('on error', e) }}
              controls={[]}
              options={{
                controls: [],
                hideControls: true,
                fullscreen: { enabled: false },
                youtube: {
                  noCookie: true,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                },
              }}
              source={{
                type: 'video',
                sources: [
                  {
                    src: props.movie.meta.trailerUrl,
                    provider: 'youtube',
                  },
                ],
              }}
          />
        </Box>
        <Grid sx={{ zIndex: '99', marginTop: '-3rem' }} container spacing={2}>
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', padding: '0' }} item xs={3}>
            <Poster
              img={gatewayHelper.dummyParse(props.movie.images['medium'])}
              title={props.movie.meta.title}
              progress={0}
              year={props.movie.meta.year}
              canHover={true}
              size={{
                height: '100% !important'
              }}
            />
          </Grid>
          <Grid item xs={9} sx={{ pb: 2 }}>
            <Grid container spacing={1}>
              <Grid sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }} item xs={12}>
                <MovieText color={'#ffffff'} fontSize={'40px'} fontWeight={'bold'}>{props.movie.meta.title}</MovieText>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }} item xs={12}>
                <MovieText color={'#D1D2D3'} fontSize={'20px'} fontWeight={'regular'}>{props.movie.meta.genres.join(' - ')}</MovieText>
                <MovieText color={'#ffffff'} fontSize={'20px'} fontWeight={'bold'}>{props.movie.meta.year}</MovieText>
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'start', justifyContent: 'center', padding: '0 1rem', maxHeight: '9rem', overflow: 'auto' }} item xs={12}>
                <MovieText sx={{ textAlign: 'justify' }} color={'#D1D2D3'} fontSize={'16px'} fontWeight={'regular'}>
                  {props.movie.meta.synopsis}
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

          {/*<hr style={{ borderTop: '1px solid rgb(241, 238, 239, 0.2)', width: 'calc(100% - 3rem)', marginTop: '3rem' }} />*/}

          {/*<Grid display={'flex'} sx={{ alignItems: 'center', justifyContent: 'center' }} item xs={12}>*/}
          {/*  <Box display={'flex'} sx={{ width: 'calc(100% - 2rem)', alignItems: 'center', justifyContent: 'center' }}>*/}
          {/*    /!*<ControllerSlider movies={movies} title='More titles like this' />*!/*/}
          {/*  </Box>*/}
          {/*</Grid>*/}
        </Grid>
      </MovieDetailsWrapper>
    </MovieDetailsContainer>
  )
}

const MemoizedPlyr = React.memo(
    React.forwardRef((props, ref) => (
        <Plyr ref={ref} {...props} />
    ))
);

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
  backgroundColor: 'transparent'
}))

export const MovieDetailsBackdrop = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  zIndex: '9',
  position: 'absolute',
  top: '0',
  left: '0',
  backgroundColor: 'rgb(0,0,0,0.43)'
}))

export const MovieDetailsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 3rem)',
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
    background: 'transparent'
  }
}))

export const MovieText = styled(Typography)((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  color: props.color,
  margin: props.margin
}))

