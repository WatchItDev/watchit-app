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
import { varFade } from 'src/components/animate';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel/index';
import { IconFlagFilled, IconStarFilled, IconPlayerPlay } from '@tabler/icons-react';
import Stack from '@mui/material/Stack';
import { Poster } from '../../poster/types';
import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';

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
      sx: { position: 'absolute', bottom: 20, right: '50px', color: '#fff' },
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
  const router = useRouter();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const handlePlay = () => {
    router.push(paths.dashboard.movie.details(poster.id));
  }

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
      <Image dir="ltr" alt={poster.title} src={poster.images.vertical} ratio="21/9" />

      <Box sx={{
        bottom: 0,
        zIndex: 8,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        position: 'absolute',
        ...bgGradient({
          direction: 'to top',
          startColor: `#1E1F22 0%`,
          endColor: `${alpha('#1E1F22', 0.2)} 100%`,
        }),
      }} />
      <Box sx={{
        bottom: 0,
        zIndex: 7,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        position: 'absolute',
        ...bgGradient({
          direction: 'to top',
          startColor: `${alpha('#1E1F22', 0.7)} 30%`,
          endColor: `${alpha('#1E1F22', 0.2)} 100%`,
        }),
      }} />



      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          // width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          padding: '50px 50px 20px !important',
          width: '50%',
          '@media (max-width: 500px)': {
            width: '100%',
          }
        }}
      >
        {/* Title */}
        <m.div variants={variants}>
          <Typography sx={{ fontSize: 'clamp(2rem, 1vw, 3rem)', fontWeight: 'bold', lineHeight: 1.1, mb: 0.5 }} gutterBottom>
            {poster.title}
          </Typography>
        </m.div>
        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconStarFilled size={14} color="#FFCD19"/>
            <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }} variant="body2">{poster.rating}</Typography>
          </Stack>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2">{poster.year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
            { poster.genre.join('  -  ') }
          </Typography>
        </Stack>
        <Box>
          <m.div  variants={variants}>
            <Typography sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '5',
              WebkitBoxOrient: 'vertical',
              fontWeight: '700'
            }}
              variant="body2" >
              {poster.synopsis}
            </Typography>
          </m.div>
        </Box>
        <m.div className='flex space-x-6' variants={variants}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant='contained'
            sx={{
              mt: 3 ,
              color:'#FFFFFF',
              background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
              height: '40px'
            }}
            onClick={handlePlay}
          >
            <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
            Play now
          </Button>
          <Button
            variant="outlined"
            sx={{
              mt: 3,
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              height: '40px'
            }}
          >
              <IconFlagFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
              Add watchlist
          </Button>
          </Stack>
        </m.div>
      </CardContent>
    </Paper>
  );
}
