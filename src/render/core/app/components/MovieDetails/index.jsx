import React from 'react'
import { styled, Box, Typography } from "@mui/material";
import { Poster, ProfileInfo, RoundProgress, ControllerSlider, VideoPlayer } from '@zorrillosdev/watchit_uix';
import { Clock } from "tabler-icons-react";
import Grid from '@mui/material/Grid';

export const MovieDetails =()=>{
  const item = [
    {
      icon:<RoundProgress size={25} percentage={80} text={'8'} textSize={10} />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    },
    {
      icon:<RoundProgress size={25} percentage={80} text={'8'} textSize={10} />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    },
    {
      icon:<Clock />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    },
    {
      icon:<Clock />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    },
    {
      icon:<Clock />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    },
    {
      icon:<Clock />,
      title:'1h 28m',
      subTitle:'Duration',
      onClick:() => console.log('clicked profile info')
    }
  ]
  const movies = [
    {
      img:'https://cuevana3.mu/img/Mkp0NmxQeko2cXFxOVZVbDBLaEw5TTZpRmdEb1gzR1puSGVrN01RcE5QQzVpNUZFWHJDaFpHOUxDUStHd00xVQ.webp',
      title:'Renfield'
    },
    {
      img:'https://cuevana3.mu/img/SmV4UDhnZnJtd254dEk2YjQ5bm8vTzNwRTRNaU16NkJLMWJjbVVFVk02eHhQcGlwYy9NV1dUNFFsYzJWZG93cQ.webp',
      title:'Super Mario Bros: La Pelicula'
    },
    {
      img:'https://cuevana3.mu/img/b25UV3ZTaGpwNkQ2N05RMzZmQmsrSHlhUFJXN0pRMU5KcExXdDNOMGY3NnJJS3pTa0tDMGREb2hnU0wrbzJRYQ.webp',
      title:'Dungeons & Dragons: Honor entre ladrones'
    },
    {
      img:'https://cuevana3.mu/img/UUErRWRkQlZDY2JQNG0xSEVWM3ZFbWxuWG5QU3JmaGJHejhiUUZKaEVmcFcvV3djVTJzNEQvRG52emV5NTl1Qg.webp',
      title:'Misterio a la vista'
    },
    {
      img:'https://cuevana3.mu/img/YkRXS3VXV1lMdzZJMkF1dm5ZUEloSzh1T2gxR000RjBXWlhrZGUxbFQ0QXJ5T3BOMitCTGt4d0cxY2FNcU9IQQ.webp',
      title:'John Wick 4'
    },
    {
      img:'https://cuevana3.mu/img/M2tpS2s3elEvYjlnM2ZmOWdEUFhNRGtiSk4rMUR4cnRxZGhzRzliazQxekZVSUlxQmZ3R2xsODRSYTJ0Q0h2MA.webp',
      title:'¡Shazam! La furia de los dioses'
    },
    {
      img:'https://cuevana3.mu/img/a0tXYjhoY2tadm9OcEVxNXRiOThXMzZNMHN6Qnd4dnRhWCt1ZUlubTg1RmtPTFF5eXdHMXFVS2ZrckNPNW9KVQ.webp',
      title:'Ant-Man y la Avispa: Quantumanía'
    }
  ]
  return(
    <MovieDetailsContainer>
      <MovieDetailsWrapper>
        <Box sx={{bottom:'0',zIndex:'99',left:'0',position:'absolute',height:'65%',width:'100%',background:'linear-gradient(transparent, #1A1C20 24%)' }}></Box>
        <Box sx={{top:'0',zIndex:'98',left:'0',position:'absolute'}} height={'300px'} width={'100%'} >
          <VideoPlayer 
            titleMovie="Renfield"
            defaultVolumen={50}
            src="http://vjs.zencdn.net/v/oceans.mp4"
            preview={true}
          />
        </Box>

        <Grid sx={{zIndex:'99',padding:'0.5rem',marginTop:'13rem'}} container spacing={2}>
          <Grid sx={{display:'flex',alignItems:'center',justifyContent:'center'}} item xs={3}>
            <Poster 
              img={'https://cuevana3.mu/img/Mkp0NmxQeko2cXFxOVZVbDBLaEw5TTZpRmdEb1gzR1puSGVrN01RcE5QQzVpNUZFWHJDaFpHOUxDUStHd00xVQ.webp'}
              title={'Renfield'}
              progress={50}
              year={2022}
              canHover={true} 
            />
          </Grid>
          <Grid  item xs={9}>
          <Grid container spacing={1}>
            <Grid sx={{display:'flex',alignItems:'center',justifyContent:'start'}} item xs={12}>
              <MovieText color={'#ffffff'} fontSize={'40px'} fontWeight={'bold'}>Renfield</MovieText>
            </Grid>
            <Grid sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}} item xs={12}>
              <MovieText color={'#D1D2D3'} fontSize={'20px'} fontWeight={'regular'}>Thiller - Terror</MovieText> 
              <MovieText color={'#ffffff'} fontSize={'20px'} fontWeight={'bold'}>2019</MovieText> 
            </Grid>
            <Grid sx={{display:'flex',alignItems:'center',justifyContent:'between'}} item xs={12}>
              <MovieText sx={{textAlign:'justify'}} color={'#D1D2D3'} fontSize={'16px'} fontWeight={'regular'}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                Laudantium incidunt dolorum dolor suscipit debitis. Quisquam 
                vitae fuga temporibus tempore consectetur, ab voluptates! Quod 
                deserunt voluptates reprehenderit possimus enim placeat officiis.
              </MovieText> 
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {item.map(x=>{
                  return(
                    <Grid sx={{display:'flex'}} item xs={2}>
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

        <hr style={{borderTop:'1px solid rgb(241, 238, 239, 0.2)',width:'calc(100% - 5rem)',marginTop:'3rem' }}/>

        <Grid display={'flex'} sx={{alignItems:'center',justifyContent:'center'}}item xs={12}>
          <Box display={'flex'} sx={{width:'calc(100% - 2rem)',alignItems:'center',justifyContent:'center'}}>
          <ControllerSlider movies={movies} title='More titles like this' />
          </Box>
        </Grid>
        </Grid>
      </MovieDetailsWrapper>
    </MovieDetailsContainer>
  )
}

export default MovieDetails

export const MovieDetailsContainer = styled(Box)((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'center',
  height: 'calc(100% - 10rem)',
  width:'100%',
  height:'100vh',
  zIndex:'97',
  /* backgroundColor: 'rgb(0,0,0,0.43)', */
}))

export const MovieDetailsWrapper = styled(Box)((props) => ({
  display: 'flex',
  height: 'calc(100% - 3rem)',
  maxHeight:'910px',
  width:'848px',
  zIndex:'10',
  borderRadius:'10px',
  position:'relative',
  overflowX:'auto',
  backgroundColor:'#1A1C20',
  '&::-webkit-scrollbar':{
    width: '0', 
    background: 'transparent ' 
  },
  "&::-webkit-scrollbar-thumb":{
    background: '#FF0000'
  }
}))

export const MovieText = styled(Typography)((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  color: props.color,
  margin: props.margin
}))

