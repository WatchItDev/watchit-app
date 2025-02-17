import { useState, useEffect } from 'react';
import { Profile } from '@lens-protocol/api-bindings';

// MUI
import Box from '@mui/material/Box';

// Project imports
import Carousel, { useCarousel } from '@src/components/carousel/index';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';
import CarouselNavigationArrows from '@src/components/carousel/components/CarouselNavigationArrows.tsx';
import { useItemsPerSlide } from '@src/hooks/components/use-item-per-slide.ts';
import CarouselCreatorsSlide from "@src/components/carousel/components/CarouselCreatorsSlide.tsx";

// Types
import { CarouselCreatorsProps } from './types';
// ----------------------------------------------------------------------

export default function CarouselCreators({
                                           data,
                                           title,
                                           minItemWidth,
                                           maxItemWidth,
                                         }: CarouselCreatorsProps) {
  const { itemsPerSlide, parentRef } = useItemsPerSlide({ minItemWidth, maxItemWidth });
  const [slideData, setSlideData] = useState<Profile[][]>([]);

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    lazyLoad: 'progressive',
  });

  useEffect(() => {
    const chunkSize = itemsPerSlide * 2;
    const chunks: Profile[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    setSlideData(chunks);
  }, [itemsPerSlide, data]);

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
          '.slick-track': {
            height: '100%',
          },
          '.slick-slide': {
            height: '100%',
          },
          '.slick-slide > div': {
            height: '100%',
          },
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slideData.map((slideItems, index) => (
            <CarouselCreatorsSlide key={`slide-${index}`} items={slideItems} itemsPerRow={itemsPerSlide} />
          ))}
        </Carousel>
      </Box>
    </CarouselSection>
  );
}
