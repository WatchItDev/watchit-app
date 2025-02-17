import CarouselWrapper from './CarouselWrapper';
import CarouselCreatorsSlide from '@src/components/carousel/components/CarouselCreatorsSlide.tsx';
import { CarouselCreatorsProps } from './types';

export default function CarouselCreators({
                                           data,
                                           title,
                                           minItemWidth,
                                           maxItemWidth,
                                         }: CarouselCreatorsProps) {
  const carouselSettings = {
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    lazyLoad: 'progressive',
  };

  const boxStyle = {
    '.slick-track': {
      height: '100%',
    },
    '.slick-slide': {
      height: '100%',
    },
    '.slick-slide > div': {
      height: '100%',
    },
  };

  return (
    <CarouselWrapper
      data={data}
      title={title}
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
      renderSlide={(slideItems, itemsPerRow, index) => (
        <CarouselCreatorsSlide key={`slide-${index}`} items={slideItems} itemsPerRow={itemsPerRow} />
      )}
      carouselSettings={carouselSettings}
      boxStyle={boxStyle}
    />
  );
}
