// @mui
import Box from '@mui/material/Box';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel/index';
import PosterHorizontal from 'src/components/poster/variants/poster-horizontal';
import { Poster } from '../../poster/types';

// ----------------------------------------------------------------------

type Props = {
  data: Poster[]
};

export default function CarouselPosterHorizontal({ data }: Props) {
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
            <Box key={item.id} sx={{ px: 0.75 }}>
              <PosterHorizontal {...item} />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
