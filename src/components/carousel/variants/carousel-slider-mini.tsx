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
import PosterMini from 'src/components/poster/variants/poster-mini';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
  title: String
};

export default function CarouselSliderMini({ data,title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 4) % data.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 4 + data.length) % data.length;
      return newIndex;
    });
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

      <Box sx={{display:'flex',flexDirection:'column',height:'100%',width:'100%'}} >
        {
          data.slice(currentIndex, currentIndex + 4).map((item) => (
            <Box key={item.id} sx={{ px: 0.75, display:'flex !important',margin:'10px 0' }}>
              <PosterMini {...item} />
            </Box>
          ))
        }
      </Box>
    </>
  );
}
