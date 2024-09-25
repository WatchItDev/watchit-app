import React, { FC, useState, useRef, useEffect } from 'react'
import { styled, Box, BoxProps, Typography, Grid, IconButton, Button } from '@mui/material'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotate,
  IconStarFilled,
  IconRewindBackward15,
  IconRewindForward15,
  IconHeartFilled,
  IconMessageCircle,
  IconFocusCentered,
  IconDotsVertical,
  IconChevronLeft
} from '@tabler/icons-react';
import Label from '../label'
import ProgressBar from './components/ProgressBar/ProgressBar'
/* import { PlayArrow, Pause, RefreshSharp, Translate, Close, Cast } from '@mui/icons-material' */
/* import Replay10Icon from '@mui/icons-material/Replay10'
import Forward10Icon from '@mui/icons-material/Forward10' */
import { ButtonCustom } from './components/Button/Button'
import SliderVolumen from './components/SliderVolumen/SliderVolumen'
import ListItems from './components/ListItem/ListItem'
import PopUp from './components/PopUp/PopUp'
import { useResponsive } from '../../hooks/use-responsive';
import { paths } from '../../routes/paths';

export type VideoPlayerProps = {
  src: string
  titleMovie: string
  preview?: boolean
  defaultVolume: number
  /* currentTime?: number */
  onClose?: () => void
  onBack?: () => void
  autoPlay?: boolean
}

const item = [
  {
    id:'t1',
    title:'Samsung Smart TV S6'
  },
  {
    id:'t2',
    title:'Samsung Smart TV S10'
  }
]

const item2 = [
  {
    id:'t1',
    title:'English',
  },
  {
    id:'t2',
    title:'Spanish',
  },
  {
    id:'t3',
    title:'German',
  }
]

const item3 = [
  {
    id:'t1',
    title:'English',

  },
  {
    id:'t2',
    title:'Spanish',

  },
  {
    id:'t3',
    title:'German',

  },
  {
    id:'t4',
    title:'Chinese',

  },
  {
    id:'t5',
    title:'Corean',
  }
]

export const VideoPlayer: FC<VideoPlayerProps> = ( {src,titleMovie,preview,defaultVolume,onClose,autoPlay, onBack }) : JSX.Element => {
  const [ show, setShow ] = useState(false)
  const [ duration, setDuration ] = useState(0)
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ openCastOption, setOpenCastOption ] = useState(false)
  const [ openLanguageOption, setOpenLanguageOption ] = useState(false)
  const video = useRef<HTMLVideoElement>(null);
  const mdUp = useResponsive('up', 'md');

  const playVideo = () => {
    if ((currentTime / duration) * 100 < 100) {
      if (video.current) {
        if (show) {
          video.current.pause();
        } else {
          video.current.play();
        }
      }
      setShow(!show);
    } else if (video.current) {
      video.current.currentTime = 0;
      video.current.play();
    }
  };

  const nextVideo = () => {
    if (video.current !== null) {
      video.current.currentTime += 10;
    }
  };

  const prevVideo = () => {
    if (video.current !== null) {
      video.current.currentTime -= 10;
    }
  };

  const handleVolumne = ( value:number ) => {
    const volumenStep = value / 100
    if (video.current !== null) {
      video.current.volume = volumenStep;
    }
  };

  useEffect(()=>{
    const videoR =  video.current
    const timeUpdateHandler =()=>{
      if (videoR !== null) {
        setCurrentTime(videoR.currentTime)
      }
    }
    const loadedMetaHandler =()=>{
      if (videoR !== null) {
        setDuration(videoR.duration)
      }
    }

    videoR?.addEventListener('timeupdate',timeUpdateHandler)
    videoR?.addEventListener('loadedmetadata',loadedMetaHandler)

    return()=>{
      if (videoR !== null) {
        videoR.removeEventListener('timeupdate',timeUpdateHandler)
        videoR.removeEventListener('loadedmetadata',loadedMetaHandler)
      }
    }

  },[video]);

  useEffect(() => {
    const volumenStep = defaultVolume / 100;
    if (video.current !== null) {
      video.current.volume = volumenStep;
    }
  }, [defaultVolume]);

  const handleProgressVideo = (increaseValue:number) => {
    const time = duration * (increaseValue / 100)
    if (video.current !== null) {
      video.current.currentTime = time;
    }
  };

  useEffect(() => {
    const volumenStep = defaultVolume / 100;
    if (video.current !== null) {
      video.current.volume = volumenStep;
      setShow(prevShow => !prevShow);
    }
  }, [defaultVolume]);

  useEffect(() => {
    if ((currentTime / duration) * 100 < 100 && preview) {
        if (video.current) {
            if (show) {
                video.current.play();
            } else {
                video.current.pause();
            }
        }
        setShow(prevShow => !prevShow);
    }
  }, [currentTime, duration, preview, show]);

  useEffect(() => {
    if ((currentTime / duration) * 100 === 100 && preview) {
      if (video.current) {
        video.current.play();
      }
      setShow((prevShow) => !prevShow);
    }
  }, [currentTime, duration, preview]);

  useEffect(() => {
    if (video.current !== null) {
      if (autoPlay) {
        video.current.play();
      }
      setShow(!!autoPlay);
    }
  }, [autoPlay]);

  const getIcon = () => {
    if ((currentTime / duration) * 100 >= 100) {
      return <IconRotate style={{ color: '#D1D2D3 !important' }} />;
    }

    return show
      ? <IconPlayerPauseFilled style={{ color: '#D1D2D3 !important' }} />
      : <IconPlayerPlayFilled style={{ color: '#D1D2D3 !important' }} />;
  };

  return (
    <VideoPlayerWrapper>
      <CustomVideo ref={ video } preview={ !!preview }>
        <source type='video/mp4' src={src}/>
          </CustomVideo>
            <ButtonsPlayerWrapper>
              { !preview &&
                <TopButtonWrapper>
                  <Button
                    onClick={onBack} disableFocusRipple
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#24262A',
                      borderRadius: 1.5,
                      m: 1,
                      p: 0.2,
                      '&:hover': {
                        backgroundColor: '#1E1F22'
                      }
                    }}
                  >
                    <IconButton disableRipple>
                      <IconChevronLeft size={20} />
                      <Typography sx={{ ml: 1 }} variant='subtitle2'>Back</Typography>
                    </IconButton>
                    {mdUp && <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>}
                  </Button>
                </TopButtonWrapper>
              }

        <PlayerBarWrapper>
          <Grid
            container spacing={2} width='100%'
            display='flex' alignItems='center'
          >
            { !preview &&
              <>
                <Grid
                  item xs={12}
                  display='flex' alignItems='end'
                  justifyContent='space-between'
                >
                  <Box sx={{textAling:'center'}}>
                    <Typography sx={{ fontSize: 'clamp(1.5rem, 1vw, 2.5rem)',fontWeight: 'bold' }} gutterBottom>
                      {titleMovie}
                    </Typography>
                  </Box>
                  <Box sx={{textAling:'center'}}>
                    <Typography sx={{ fontSize: 'clamp(0.5rem, 1vw, 0.8rem)',marginRight:'20px'}} gutterBottom>
                      47:38 / 1:52:32
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item xs={12} width='100%'
                  display='flex' alignItems='center'
                >
                  <Grid
                    container spacing={2} width='100%'
                    display='flex' alignItems='center'
                  >
                    <Grid
                      item xs={12} width='100%'
                      display='flex' alignItems='center'
                    >
                      <ProgressBar
                        percentage={(currentTime / duration) * 100}
                        showBullet
                        onNewPercentage={(increaseValue: number) => handleProgressVideo(increaseValue)}
                      />
                    </Grid>
                    <Grid
                      item xs={12} width='100%'
                      display='flex' alignItems='center'
                    >
                        <Box sx={{width:'100%'}}>
                          { !preview &&
                            <ButtonCustom
                              width='30px'
                              backgroundColor='transparent'
                              variant='flat'
                              icon={getIcon()}
                              onClick={playVideo}
                            />
                          }
                          { !preview &&
                            <ButtonCustom
                              width='30px'
                              backgroundColor='transparent'
                              variant='flat'
                              icon={<IconRewindBackward15 color="#FFFFFF" />}
                              onClick={()=>{prevVideo()}}
                            />
                          }
                          { !preview &&
                            (currentTime/duration) * 100 < 100 &&
                              <ButtonCustom
                                width='30px'
                                backgroundColor='transparent'
                                variant='flat'
                                icon={<IconRewindForward15 color="#FFFFFF" />}
                                onClick={()=>{nextVideo()}}
                              />
                          }
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                          <SliderVolumen
                            alwaysShow={ false }
                            defaultVolume={ defaultVolume }
                            onChange={ ( value:number ) => handleVolumne( value ) }
                          />
                          <ButtonCustom
                            width='30px'
                            backgroundColor='transparent'
                            variant='flat'
                            icon={<IconHeartFilled color="#FFFFFF" />}
                            onClick={()=>{nextVideo()}}
                          />
                          <ButtonCustom
                            width='30px'
                            backgroundColor='transparent'
                            variant='flat'
                            icon={<IconMessageCircle color="#FFFFFF" />}
                            onClick={()=>{nextVideo()}}
                          />
                          <ButtonCustom
                            width='30px'
                            backgroundColor='transparent'
                            variant='flat'
                            icon={<IconFocusCentered color="#FFFFFF" />}
                            onClick={()=>{nextVideo()}}
                          />
                          <ButtonCustom
                            width='30px'
                            backgroundColor='transparent'
                            variant='flat'
                            icon={<IconDotsVertical color="#FFFFFF" />}
                            onClick={()=>{nextVideo()}}
                          />

                        </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            }
          </Grid>
        </PlayerBarWrapper>
      </ButtonsPlayerWrapper>
    </VideoPlayerWrapper>
  )
}

const VideoPlayerWrapper = styled( Box )<BoxProps>(() => ({
  width:'100%',
  height:'100%',
  position:'relative',
  backgroundSize:'cover',
  backgroundColor:'#1A1C20'
}))

const CustomVideo = styled( 'video' )<{ preview: boolean }>(( props ) => ({
  zIndex:'98',
  width:'100%',
  height:'100%',
  lineHeight:0,
  objectFit:`${props?.preview ? 'cover': 'revert'}`
}))

const PlayerBarWrapper = styled( Box )<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  width: 'calc(100% - 2rem)',
  flexDirection: 'column',
  position: 'absolute',
  bottom: '19px'
}))

const TopButtonWrapper = styled( Box )<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  left: '10px',
  position: 'absolute',
  justifyContent: 'space-between',
  top: '20px'
}))

const ButtonsPlayerWrapper = styled( Box )<BoxProps>(() => ({
  top: '0',
  zIndex: '99',
  gap: '0.5rem',
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgb(0,0,0,0.43)'
}))

export const PosterImage = styled( Box )<BoxProps & { src: string }>(() => ({
  width: '100%',
  height: '100%',
  position: 'relative'
}))

export default VideoPlayer
