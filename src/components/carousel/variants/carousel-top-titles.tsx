import Box from '@mui/material/Box';
import Carousel, {
  CarouselArrows,
  useCarousel,
} from '@src/components/carousel/index';
import PosterTopTitles from '@src/components/poster/variants/poster-top-titles.tsx';
import { CarouselTopTitlesProps } from '../types';
import { Post } from '@src/graphql/generated/graphql.ts';

export default function CarouselTopTitles({
  posts,
  category,
}: Readonly<CarouselTopTitlesProps>) {
  const carousel = useCarousel({
    slidesToShow: 1,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
  });

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '.slick-track': {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
        },
        '.slick-slide': {
          height: 'fit-content',
        },
        '.slick-list': {
          height: 'auto',
        },
        '.slick-slide > div': {
          height: 'auto',
        },
      }}
    >
      <CarouselArrows
        filled
        shape="rounded"
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        leftButtonProps={{ sx: { top: { xs: '44%', sm: '50%' } } }}
        rightButtonProps={{ sx: { top: { xs: '44%', sm: '50%' } } }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {posts.map((post: Post) => (
            <Box key={`${category}-${post.id}`} sx={{ height: '100%' }}>
              <PosterTopTitles post={post} />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
