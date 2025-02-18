import { Profile } from '@lens-protocol/api-bindings';
import CarouselWrapper from './CarouselWrapper';
import CarouselSlide from '@src/components/carousel/components/CarouselSlide';
import { UserItem } from '@src/components/user-item';
import { CarouselCreatorsProps } from '../types';
import {PublicationType} from "@lens-protocol/react-web";

export default function CarouselCreators(params: CarouselCreatorsProps) {
  const { data, title, minItemWidth, maxItemWidth } = params;

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

  const renderItem = (profile: Profile) => (
    <UserItem profile={profile} onActionFinished={() => {}} followButtonMinWidth={90} />
  );

  const carouselParams = {
    data,
    title,
    minItemWidth,
    maxItemWidth,
    renderSlide: (slideItems: PublicationType, itemsPerRow: number, index: number) => (
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
    <CarouselWrapper{... carouselParams} />
  );
}
