import Box from '@mui/material/Box';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import CarouselNavigationArrows from '@src/components/carousel/components/CarouselNavigationArrows.tsx';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';
import { useItemsPerSlide } from '@src/hooks/components/use-item-per-slide';
import { useChunkedData } from '@src/hooks/components/use-chunked-data';
import { CarouselWrapperProps } from '../types';

export default function CarouselWrapper<T>(props: Readonly<CarouselWrapperProps<T>>) {
  const {
    data,
    title,
    minItemWidth,
    maxItemWidth,
    renderSlide,
    carouselSettings,
    boxStyle,
    boxClassName,
  } = props;

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
