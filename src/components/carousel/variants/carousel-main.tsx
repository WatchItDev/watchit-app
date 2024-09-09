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
import { IconFlagFilled, IconStarFilled, IconPlayerPlay } from '@tabler/icons-react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Poster } from '../../poster/types';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
};

export default function CarouselMain({ data }: Props) {
  const carousel = useCarousel({
    speed: 800,
    // autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', bottom: 50, right: '50px', color: '#fff' },
    }),
  });

  return (
    <Card sx={{ borderRadius: 0, boxShadow: 'none' }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data.map((poster, index) => (
          <CarouselItem key={poster.id} poster={poster} active={index === carousel.currentIndex} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  poster: Poster
  active: boolean;
};

function CarouselItem({ poster, active }: CarouselItemProps) {
  const theme = useTheme();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
      <Image dir="ltr" alt={poster.title} src={poster.images.vertical} ratio="21/9" />

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
          }),
        }}
      >
        {/* Title */}
        <m.div variants={variants}>
          <Typography sx={{ fontSize: 'clamp(2rem, 1vw, 3rem)',fontWeight: 'bold' }} gutterBottom>
            {poster.title}
          </Typography>
        </m.div>
        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconStarFilled size={14} color="#FFCD19"/>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">{poster.rating}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">|  {poster.year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2">|  {poster.genre}</Typography>
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
              {poster.synopsis}
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
    </Paper>
  );
}
