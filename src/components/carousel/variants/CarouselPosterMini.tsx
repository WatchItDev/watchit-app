// @ts-ignore
import { Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import CarouselWrapper from './CarouselWrapper';
import CarouselPosterSlide from '@src/components/carousel/components/CarouselPosterMIniSlide.tsx';
import { CarouselPosterMiniProps } from './types';

export default function CarouselPosterMini({
                                             data,
                                             title,
                                             minItemWidth,
                                             maxItemWidth,
                                           }: CarouselPosterMiniProps) {
  const carouselSettings = {
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
  };

  const boxStyle = {
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
  };

  return (
    <CarouselWrapper
      data={data}
      title={title}
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
      renderSlide={(slideItems, itemsPerRow, index) => (
        <CarouselPosterSlide
          key={`slide-publications-${index}`}
          items={slideItems}
          itemsPerRow={itemsPerRow}
        />
      )}
      carouselSettings={carouselSettings}
      boxStyle={boxStyle}
    />
  );
}
