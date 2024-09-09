import { useEffect } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel/index';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import { m } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconFlagFilled, IconStarFilled, IconPlayerPlay } from '@tabler/icons-react';
import Stack from '@mui/material/Stack';
import TextMaxLine from '../../text-max-line';
import Iconify from '../../iconify';
import { MotionContainer, varFade } from '../../animate';
import { Poster } from '../../poster/types';
import { PosterVertical } from '../../poster';


// ----------------------------------------------------------------------

const StyledThumbnailsContainer = styled('div')<{ length: number }>(({ length, theme }) => ({
  position: 'absolute',
  bottom: 75,
  right: '50px',
  zIndex: 1,
  maxWidth: '45%',
  borderRadius: 2,
  '& .slick-slide': {
    lineHeight: 0,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
};

export default function CarouselMixed({ data }: Props) {
  const carouselLarge = useCarousel({
    draggable: true,
    swipeToSlide: true,
    adaptiveHeight: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', top: 50, right: '50px', color: '#fff' },
    }),
  });

  const carouselThumb = useCarousel({
    swipeToSlide: true,
    focusOnSelect: true,
    slidesToShow: 3
  });

  useEffect(() => {
    carouselLarge.onSetNav();
    carouselThumb.onSetNav();
  }, [carouselLarge, carouselThumb]);

  const renderLargeImg = (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
      >
        {data.map((poster, index) => (
          <Box key={poster.id}>
            <CarouselLargeItem poster={poster} active={carouselLarge.currentIndex === index} />
          </Box>
        ))}
      </Carousel>
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={data.length}>
      <Carousel
        {...carouselThumb.carouselSettings}
        asNavFor={carouselLarge.nav}
        ref={carouselThumb.carouselRef}
      >
         {data.map((poster, index) => (
          <Box key={poster.id} sx={{ px: 0.75 }}>
            <CarouselThumbItem poster={poster} active={carouselLarge.currentIndex === index} />
          </Box>
         ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {renderLargeImg}

      {renderThumbnails}
    </Box>
  );
}


type CarouselThumbItemProps = {
  active: boolean;
  poster: Poster
};

function CarouselThumbItem({ poster, active }: CarouselThumbItemProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        opacity: 0.48,
        cursor: 'pointer',
        ...( active && {
          opacity: 1,
          border: `solid 4px ${theme.palette.primary.main}`,
        }),
      }}
    >
      <PosterVertical {...poster} />
    </Paper>
  );
}


type CarouselLargeItemProps = {
  poster: Poster
  active: boolean
};

function CarouselLargeItem({ poster, active }: CarouselLargeItemProps) {
  const theme = useTheme();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
      
      <Image dir="ltr" alt={poster.title} src={poster.images.wallpaper} ratio="21/9" />

      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          position: 'absolute',
          zIndex: 0,
          ...bgGradient({
            direction: 'to top',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0)} 100%`,
          }),
        }}
      />
        
      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          zIndex: 0,
          position: 'absolute',
          ...bgGradient({
            direction: 'to bottom',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0)} 100%`,
          }),
        }}
      />

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
        <Box sx={{
          width: '40%',
          position: 'absolute',
          top: '-80px'
        }}>
          <m.div variants={variants}>
            <Typography lineHeight={1} sx={{ fontSize: 'clamp(1.7rem, 1vw, 2.5rem)',fontWeight: 'bold' }} noWrap gutterBottom>
              Featured in watchit
            </Typography>
            <Typography color="common.gray" lineHeight={1} sx={{ fontSize: 'clamp(0.8rem, 1vw, 2rem)' }} noWrap gutterBottom>
              Best featured for you today
            </Typography>
          </m.div>
        </Box>

        {/* Title */}
        <Box sx={{width: '40%'}}>
          <m.div variants={variants}>
            <Typography  noWrap gutterBottom>
              {poster.title}
            </Typography>
          </m.div>
        </Box>
        {/* Details: Ratinsx={{ fontSize: 'clamp(1.5rem, 1vw, 2rem)',fontWeight: 'bold' }}g, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconStarFilled size={14} color="#FFCD19"/>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">{poster.rating}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">|  {poster.year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.3rem, 1vw, 0.7rem)'}} variant="body2">|  {poster.genre}</Typography>
        </Stack>
        <Box sx={{width: '40%'}}>
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
