import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import { CarouselSection } from '@src/components/poster/carousel-section.tsx';
import CarouselNavigationArrows from '@src/components/carousel/CarouselNavigationArrows.tsx';
import { Profile } from '@lens-protocol/api-bindings';
import { UserItem } from '@src/components/user-item';
import { CarouselCreatorsProps, CarouselSlideProps } from './types';
import { calculateItemsPerSlide } from './utils';

// ----------------------------------------------------------------------

export default function CarouselCreators({
  data,
  title,
  minItemWidth,
  maxItemWidth,
}: CarouselCreatorsProps) {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [slideData, setSlideData] = useState<Profile[][]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
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
    const chunks: Profile[][] = [];
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
          '.slick-track': {
            height: '100%',
          },
          '.slick-slide': {
            height: '100%',
          },
          '.slick-slide > div': {
            height: '100%',
          },
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {slideData.map((slideItems, index) => (
            <Slide key={`slide-${index}`} items={slideItems} itemsPerRow={itemsPerSlide} />
          ))}
        </Carousel>
      </Box>
    </CarouselSection>
  );
}

function Slide({ items, itemsPerRow }: CarouselSlideProps) {
  const row1 = items.slice(0, itemsPerRow);
  const row2 = items.slice(itemsPerRow, itemsPerRow * 2);
  const itemWidthPercent = 100 / itemsPerRow;

  return (
    <Box>
      {[row1, row2].map((rowItems, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex' }}>
          {rowItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                flexBasis: `${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                p: 1,
              }}
            >
              <UserItem profile={item} onActionFinished={() => {}} followButtonMinWidth={90} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
