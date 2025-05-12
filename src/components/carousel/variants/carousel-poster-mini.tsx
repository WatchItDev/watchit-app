import CarouselSlide from '@src/components/carousel/components/carousel-slide.tsx';
import PosterHorizontal from '@src/components/poster/variants/poster-horizontal';
import { CarouselPosterMiniProps, PublicationType } from '../types';
import CarouselWrapper from './carousel-wrapper.tsx';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication.ts';

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
    const poster = getAttachmentCid(post, 'square') || getAttachmentCid(post, 'poster');
    const wallpaper = getAttachmentCid(post, 'wallpaper');

    return (
      <PosterHorizontal
        id={post.id}
        title={post.title}
        images={{
          vertical: getMediaUri(poster),
          wallpaper: getMediaUri(wallpaper),
        }}
        likes={post.likeCount}
        synopsis={post.description}
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
