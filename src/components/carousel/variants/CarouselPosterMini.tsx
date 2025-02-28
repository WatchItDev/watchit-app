import CarouselSlide from '@src/components/carousel/components/CarouselSlide';
import PosterHorizontal from '@src/components/poster/variants/poster-horizontal';
import { CarouselPosterMiniProps, PublicationType } from '../types';
import CarouselWrapper from './CarouselWrapper';

export default function CarouselPosterMini(params: CarouselPosterMiniProps) {
  const { data, title, minItemWidth, maxItemWidth } = params;

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

  const renderItem = (post: PublicationType) => {
    const getMediaUri = (cid: string): string => `${cid}`;
    const getWallpaperCid = (post: PublicationType): string =>
      post?.metadata?.attachments?.find((el: PublicationType) => el.altTag === 'wallpaper')?.image?.raw?.uri;
    const getPosterCid = (post: PublicationType): string =>
      post?.metadata?.attachments?.find((el: PublicationType) => el.altTag === 'poster')?.image?.raw?.uri;

    return (
      <PosterHorizontal
        id={post.id}
        title={post?.metadata?.title}
        images={{
          vertical: getMediaUri(getPosterCid(post)),
          wallpaper: getMediaUri(getWallpaperCid(post)),
        }}
        likes={post.globalStats.upvotes}
        synopsis={post.metadata.content}
      />
    );
  };

  return (
    <CarouselWrapper
      {...{
        data,
        title,
        minItemWidth,
        maxItemWidth,
        renderSlide: (slideItems, itemsPerRow, index) => (
          <CarouselSlide
            key={`slide-${index}`}
            items={slideItems}
            itemsPerRow={itemsPerRow}
            renderItem={renderItem}
          />
        ),
        carouselSettings,
        boxStyle,
      }}
    />
  );
}
