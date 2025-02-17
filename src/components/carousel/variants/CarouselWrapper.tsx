import React from 'react';
import Box from '@mui/material/Box';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import CarouselNavigationArrows from '@src/components/carousel/components/CarouselNavigationArrows.tsx';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';
import { useItemsPerSlide } from '@src/hooks/components/use-item-per-slide.ts';
import { useChunkedData } from '@src/hooks/components/use-chunked-data';

interface CarouselWrapperProps<T> {
  data: T[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
  renderSlide: (slideItems: T[], itemsPerRow: number, index: number) => React.ReactNode;
  carouselSettings: any;
  boxStyle?: any; // Update this to accept any style object
  boxClassName?: string;
}

export default function CarouselWrapper<T>({
                                             data,
                                             title,
                                             minItemWidth,
                                             maxItemWidth,
                                             renderSlide,
                                             carouselSettings,
                                             boxStyle,
                                             boxClassName,
                                           }: CarouselWrapperProps<T>) {
  const { itemsPerSlide, parentRef } = useItemsPerSlide({ minItemWidth, maxItemWidth });
  const slideData = useChunkedData<T>(data, itemsPerSlide);

  const carousel = useCarousel({
    ...carouselSettings,
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
          ...boxStyle,
        }}
        className={boxClassName}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slideData.map((slideItems, index) => renderSlide(slideItems, itemsPerSlide, index))}
        </Carousel>
      </Box>
    </CarouselSection>
  );
}
