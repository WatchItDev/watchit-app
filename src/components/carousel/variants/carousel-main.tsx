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
          <Typography variant="h6" gutterBottom>
            {poster.title}
          </Typography>
        </m.div>
        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography style={{fontSize: 'clamp(0.1rem, 2vw + 1rem, 0.7rem)',}} /* variant="body2" */>{poster.rating} ★</Typography>
          <Typography style={{fontSize: 'clamp(0.1rem, 2vw + 1rem, 0.7rem)',}} /* variant="body2" */>| {poster.year}</Typography>
          <Typography /* style={{fontSize: 'clamp(1rem, 2vw + 1rem, 3rem)',}} */ variant="body2">| {poster.genre}</Typography>
        </Stack>
        <m.div variants={variants}>
          <Typography variant="body2" noWrap gutterBottom>
            {poster.synopsis}
          </Typography>
        </m.div>
        <m.div variants={variants}>
          <Button variant="contained" sx={{ mt: 3 }}>
            View More
          </Button>
        </m.div>
      </CardContent>
    </Paper>
  );
}
