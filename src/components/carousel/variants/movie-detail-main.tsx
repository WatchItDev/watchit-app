import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel/index';
import { IconEyeFilled, IconStarFilled, IconPlayerPlay } from '@tabler/icons-react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { PosterVertical } from '../../poster';
import { Poster } from '../../poster/types';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
};

export default function MovieDetailMain({ data }: Props) {
  const theme = useTheme();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none',height:'100%'}}>
      <Image dir="ltr" alt={data[0].title} src={data[0].images.vertical} ratio="21/9" />

      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          ...bgGradient({
            direction: 'to top',
            startColor: `#000 25%`,
            endColor: `${alpha('#000', 0)} 100%`,
          })
        }}
      >
        {/* Title */}
        <Box sx={{display:'flex',paddingBottom:'30px'}}>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'end'}}>
        <m.div variants={variants}>
          <Typography sx={{ fontSize: 'clamp(2rem, 1vw, 3rem)',fontWeight: 'bold' }} gutterBottom>
            {data[0].title}
          </Typography>
        </m.div>
        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconStarFilled size={14} color="#FFCD19"/>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">{data[0].rating}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">|  {data[0].year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">|  {data[0].genre}</Typography>
        </Stack>
        
        <Box  sx={{
          width: '50%',
          '@media (max-width: 500px)': {
            width: '100%', 
          },
        }}>
          <m.div  variants={variants}>
            <Typography sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '5',
              WebkitBoxOrient: 'vertical',
            }} 
              variant="body2" >
              {data[0].synopsis}
            </Typography>
          </m.div>
          
        </Box>
        
        <m.div className='flex space-x-6' variants={variants}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant='contained' sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}>
            <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' /> 
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'start'}}>
            <Typography variant="body2" sx={{ lineHeight: 1,fontWeight:'bold' , fontSize: 'clamp(0.1rem, 0.8vw, 1rem)'/* ,whiteSpace: 'nowrap'  */}}>
                Watch it!
            </Typography>
            <Box sx={{display:'flex',alignItems:'center'}}>
              <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.5rem)'/* ,whiteSpace: 'nowrap'  */}}>
                {data[0].price.wvc} WVC
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.5rem)',whiteSpace: 'nowrap' }}>
                {data[0].price.usd} USD
              </Typography>
            </Box>
            </Box>
          </Button>
          <Button variant="outlined" sx={{ mt: 3 , borderColor: '#FFFFFF',
              color: '#FFFFFF',
              '&:hover': {
                borderColor: 'darkred',
                color: 'darkred',
              }, }}>
              <IconEyeFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                Watch trailer
          </Button>
          </Stack>
        </m.div>
        </Box>
              <Box sx={{
                width:'300px',
                height:'100%',
                position:'relative',
                }}>
<Box sx={{
                width:'300px'
                }}>
<PosterVertical sx={{height:'100%'}} {...data[0]} />
                </Box>
            

          </Box>
          </Box>
      </CardContent>
    </Paper>
  );
}





  
