// @ts-ignore
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";

import Box from '@mui/material/Box';

import Carousel, { useCarousel } from '@src/components/carousel/index';
import CarouselNavigationArrows from '@src/components/carousel/components/CarouselNavigationArrows.tsx';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';
import { useItemsPerSlide } from '@src/hooks/components/use-item-per-slide.ts';
import CarouselPosterSlide from "@src/components/carousel/components/CarouselPosterMIniSlide.tsx";
import { useChunkedData } from '@src/hooks/components/use-chunked-data';

// Types
import { CarouselPosterMiniProps } from './types';

// ----------------------------------------------------------------------

export default function CarouselPosterMini({
                                             data,
                                             title,
                                             minItemWidth,
                                             maxItemWidth,
                                           }: CarouselPosterMiniProps) {
  const { itemsPerSlide, parentRef } = useItemsPerSlide({ minItemWidth, maxItemWidth });
  const slideData = useChunkedData<Post>(data, itemsPerSlide);

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
  });

  return (
    <CarouselSection
      title={title}
      action={<CarouselNavigationArrows next={carousel.onNext} prev={carousel.onPrev} />}
    >
      <Box
        ref={parentRef}
        sx={{
          overflow: 'hidden',
          position: 'relative',
          '.slick-list': {
            height: 'auto !important',
          },
          '.slick-track': {
            height: '100%',
          },
          '.slick-slide': {
            height: '100%',
            minHeight: '100%',
            maxHeight: '100%',
          },
          '.slick-slide > div': {
            height: '100%',
            minHeight: '100%',
            maxHeight: '100%',
          },
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slideData.map((slideItems, index) => (
            <CarouselPosterSlide
              key={`slide-publications-${index}`}
              items={slideItems}
              itemsPerRow={itemsPerSlide}
            />
          ))}
        </Carousel>
      </Box>
    </CarouselSection>
  );
}
