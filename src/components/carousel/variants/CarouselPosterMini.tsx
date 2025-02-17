import { useEffect, useRef, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Carousel, { useCarousel } from '@src/components/carousel/index';
// @ts-ignore
import { type Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import PosterHorizontal from '@src/components/poster/variants/poster-horizontal.tsx';
import CarouselNavigationArrows from '@src/components/carousel/CarouselNavigationArrows.tsx';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';

// Types
import { CarouselPosterMiniProps } from './types';
import { calculateItemsPerSlide } from '@src/components/carousel/variants/utils';

// ----------------------------------------------------------------------

export default function CarouselPosterMini({
  data,
  title,
  minItemWidth,
  maxItemWidth,
}: CarouselPosterMiniProps) {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [slideData, setSlideData] = useState<Post[][]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
  });

  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const parentWidth = entry.contentRect.width;
        const items = calculateItemsPerSlide({ parentWidth, minItemWidth, maxItemWidth });
        setItemsPerSlide(items);
      }
    });

    observer.observe(parentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const items = calculateItemsPerSlide({ parentWidth, minItemWidth, maxItemWidth });
      setItemsPerSlide(items);
    }
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    const chunkSize = itemsPerSlide * 2;
    const chunks: Post[][] = [];
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
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slideData.map((slideItems, index) => (
            <Slide
              key={`slide-publications-${index}`}
              items={slideItems}
              itemsPerRow={itemsPerSlide}
            />
          ))}
        </Carousel>
      </Box>
    </CarouselSection>
  );
}

type SlideProps = {
  items: Post[];
  itemsPerRow: number;
};

function Slide({ items, itemsPerRow }: SlideProps) {
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  // const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid?.replace?.('ipfs://', '')}`
  const getMediaUri = (cid: string): string => `${cid}`;
  const getWallpaperCid = (post: any): string =>
    post?.metadata?.attachments?.find((el: any) => el.altTag === 'wallpaper')?.image?.raw?.uri;
  const getPosterCid = (post: any): string =>
    post?.metadata?.attachments?.find((el: any) => el.altTag === 'poster')?.image?.raw?.uri;

  return (
    <Box>
      {[row1, row2].map((rowItems, rowIndex) => (
        <Box key={`row-publications-${rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((post) => (
            <Box
              key={post.id}
              sx={{
                flexBasis: `${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                p: 1,
              }}
            >
              <PosterHorizontal
                id={post.id}
                title={post.metadata.title}
                images={{
                  vertical: getMediaUri(getPosterCid(post)),
                  wallpaper: getMediaUri(getWallpaperCid(post)),
                }}
                likes={post.globalStats.upvotes}
                synopsis={post.metadata.content}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
