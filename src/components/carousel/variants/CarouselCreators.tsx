import { memo, FC } from 'react';
import {ExploreProfilesOrderByType, LimitType, PublicationType, useExploreProfiles} from "@lens-protocol/react-web"
import { Profile } from '@lens-protocol/api-bindings';
import CarouselSlide from '@src/components/carousel/components/CarouselSlide';
import { UserItem } from '@src/components/user-item';
import CarouselWrapper from './CarouselWrapper';
import { CarouselCreatorsProps } from '../types';
import {filterHiddenProfiles} from "@src/utils/profile.ts"

 const CarouselCreators: FC<CarouselCreatorsProps> = (params) => {
  const { title, minItemWidth, maxItemWidth } = params;

   const { data: latestCreatedProfiles } = useExploreProfiles({
     orderBy: ExploreProfilesOrderByType.LatestCreated,
     limit: LimitType.Fifty,
   });

   // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
   const filtered = latestCreatedProfiles?.filter(
     (profile: any) => profile.metadata?.displayName && profile.metadata?.bio
   );

   // Clear ###HIDDEN### profiles
   const filteredProfiles = filterHiddenProfiles(filtered);

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
    data: filteredProfiles || [],
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
    <CarouselWrapper {... carouselParams} />
  );
}

export default memo(CarouselCreators);
