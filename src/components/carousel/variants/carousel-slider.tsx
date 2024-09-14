import {useState} from 'react';
import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { Poster } from 'src/components/poster/types';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel/index';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import { IconFlagFilled, IconStarFilled, IconPlayerPlay, IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
  title: String
};

export default function CarouselSlider({ data,title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const theme = useTheme();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  return (
    <>
    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
      <Typography sx={{fontSize: 'clamp(1.5rem, 1vw, 3rem)',fontWeight:'bold'}} variant="body2">{title}</Typography>
      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Button sx={{background:'#212B36',marginRight:'5px',padding:'5px',minWidth:'0'}} variant='contained' onClick={goToPrev}>
          <IconChevronLeft style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
        </Button>
        <Button sx={{background:'#212B36',padding:'5px',minWidth:'0'}} variant='contained' onClick={goToNext}>
          <IconChevronRight style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
        </Button>
      </Box>
    </Box>
    <CardContent
        sx={{
          width: '100%',
          height:'500px',
          textAlign: 'left',
          color: 'common.white',
          padding: 0
        }}
      >
        <Box style={{width:'100%',height:'300px'}}>
          <Image sx={{height:'100%',borderRadius:'10px'}} dir="ltr" alt={data[currentIndex].title} src={data[currentIndex].images.vertical} ratio="21/9" />
        </Box>

    
        {/* Title */}
        <Box sx={{width: '100%',marginTop:'20px'}}>
          <m.div variants={variants}>
            <Typography  noWrap gutterBottom>
              {data[currentIndex].title}
            </Typography>
          </m.div>
        </Box>
        {/* Details: Ratinsx={{ fontSize: 'clamp(1.5rem, 1vw, 2rem)',fontWeight: 'bold' }}g, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconStarFilled size={14} color="#FFCD19"/>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">{data[currentIndex].rating}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">|  {data[currentIndex].year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">|  {data[currentIndex].genre}</Typography>
        </Stack>
        <Box sx={{width: '100%'}}>
          <m.div  variants={variants}>
            <Typography sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
              fontSize: 'clamp(0.3rem, 2vw, 0.9rem)'
            }} 
              variant="body2" >
              {data[currentIndex].synopsis}
            </Typography>
          </m.div>
        </Box>
        <m.div className='flex space-x-6' variants={variants}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant='contained' sx={{ mt: 3 , color:'#FFFFFF',background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)' }}>
            <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' /> Play now
          </Button>
          <Button variant="outlined" sx={{ mt: 3 , borderColor: '#FFFFFF',
              color: '#FFFFFF',
              '&:hover': {
                borderColor: 'darkred',
                color: 'darkred',
              }, }}>
              <IconFlagFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
              Add watchlist
          </Button>
          </Stack>
        </m.div>
      </CardContent>
      </>
  );
}
