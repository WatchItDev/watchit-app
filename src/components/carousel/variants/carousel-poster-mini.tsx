// @mui
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel/index';
import PosterMini from 'src/components/poster/variants/poster-mini';
import { Poster } from '../../poster/types';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
};

export default function CarouselPosterMini({ data }: Props) {
  const carousel = useCarousel({
    slidesToShow: 4,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '.slick-track': {
          height: '100%'
        },
        '.slick-slide': {
          height: '100%',
          minHeight: '100%',
          maxHeight: '100%'
        },
        '.slick-slide > div': {
          height: '100%',
          minHeight: '100%',
          maxHeight: '100%'
        }
      }}
    >
      <CarouselArrows
        filled
        shape="rounded"
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((item) => (
            <Box key={item.id} sx={{ px: 0.75, display:'flex !important', height: '100%' }}>
              <Box sx={{display:'flex',alignItems:'center'}}>
                <Typography fontWeight="fontWeightBold" sx={{ fontSize: 'clamp(2rem, 0.8vw, 2rem)', whiteSpace: 'nowrap', marginRight:'10px' }} variant='body2'>{item.id}</Typography>
              </Box>
              <PosterMini {...item} />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
