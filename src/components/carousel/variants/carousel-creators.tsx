import { memo, FC } from 'react';
import CarouselSlide from '@src/components/carousel/components/carousel-slide.tsx';
import { UserItem } from '@src/components/user-item';
import CarouselWrapper from './carousel-wrapper.tsx';
import { CarouselCreatorsProps } from '../types';
import { User } from '@src/graphql/generated/graphql.ts';

 const CarouselCreators: FC<CarouselCreatorsProps> = (params) => {
  const { profiles, title, minItemWidth, maxItemWidth } = params;

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

  const renderItem = (profile: User) => (
    <UserItem profile={profile} />
  );

  const carouselParams = {
    data: profiles || [],
    title,
    minItemWidth,
    maxItemWidth,
    renderSlide: (slideItems: User, itemsPerRow: number, index: number) => (
      <CarouselSlide
        key={`slide-${index}`}
        items={slideItems}
        itemsPerRow={itemsPerRow}
        renderItem={renderItem}
      />
    ),
    carouselSettings,
    boxStyle,
  }

  return (
    <CarouselWrapper {... carouselParams} />
  );
}

export default memo(CarouselCreators);
