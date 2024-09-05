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
import TextMaxLine from '../../text-max-line';
import Iconify from '../../iconify';
import { MotionContainer, varFade } from '../../animate';
import { Poster } from '../../poster/types';

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
      <Image alt={poster.title} src={poster.images.vertical} ratio="4/6" />

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
        <TextMaxLine variant="h4" sx={{ mb: 2 }}>
          {poster.title}
        </TextMaxLine>

        <Link
          color="inherit"
          variant="overline"
          sx={{
            opacity: 0.72,
            alignItems: 'center',
            display: 'inline-flex',
            transition: theme.transitions.create(['opacity']),
            '&:hover': { opacity: 1 },
          }}
        >
          learn More
          <Iconify icon="eva:arrow-forward-fill" width={16} sx={{ ml: 1 }} />
        </Link>
      </CardContent>
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
        component={MotionContainer}
        animate={active}
        action
        sx={{
          left: '50px',
          bottom: 75,
          maxWidth: '40%',
          p: '0px !important',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={variants}>
          <Typography variant="h3" gutterBottom>
            {poster.title}
          </Typography>
        </m.div>

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
