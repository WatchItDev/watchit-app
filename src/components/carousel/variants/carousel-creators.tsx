// @mui
import Box from '@mui/material/Box';
import Carousel, { CarouselArrows, useCarousel } from '@src/components/carousel/index';
import {TrendingTopicsType} from "@src/sections/explore/view.tsx";
import PosterCreators from "@src/components/poster/variants/poster-creators.tsx";
// ----------------------------------------------------------------------

type Props = {
  data: TrendingTopicsType [],
  category?: string
};

export default function CarouselCreators({ data, category }: Props) {
  const carousel = useCarousel({
    className: "center",
    // centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
    lazyLoad: 'progressive',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
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
        <Carousel key={`caroussel-${category}`} ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((post: any) => (
            <Box key={`ca-${category}-${post.id}`} sx={{ display:'flex !important', height: '100%' }}>
              <PosterCreators
                id={post.id}
                title={post.title}
                desc={post.desc}
                image={post.image}
              />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
