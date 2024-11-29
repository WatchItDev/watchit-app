import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Carousel, { useCarousel } from '@src/components/carousel/index';
import { TrendingTopicsType } from '@src/sections/explore/view.tsx';
import PosterCreators from '@src/components/poster/variants/poster-creators.tsx';
import {CarouselSection} from "@src/components/poster/carousel-section.tsx";
import NavigationArrows from "@src/components/carousel/NavigationArrows.tsx";

// ----------------------------------------------------------------------

type Props = {
  data: TrendingTopicsType[];
  category?: string;
  minItemWidth: number;
  maxItemWidth: number;
};

export default function CarouselCreators({ data, minItemWidth, maxItemWidth }: Props) {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [slideData, setSlideData] = useState<TrendingTopicsType[][]>([]);
  const [loading, setLoading] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);

  const carousel = useCarousel({
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    lazyLoad: 'progressive',
  });

  const calculateItemsPerSlide = (parentWidth: number) => {
    let maxItems = Math.floor(parentWidth / minItemWidth);
    let minItems = Math.floor(parentWidth / maxItemWidth);
    let items = maxItems;

    while (items >= minItems) {
      const itemWidth = parentWidth / items;
      if (itemWidth >= minItemWidth && itemWidth <= maxItemWidth) {
        break;
      }
      items--;
    }

    if (items < 1) items = 1;

    return items;
  };

  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const parentWidth = entry.contentRect.width;
        const items = calculateItemsPerSlide(parentWidth);
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
      const items = calculateItemsPerSlide(parentWidth);
      setItemsPerSlide(items);
      setLoading(false);
    }
  }, [minItemWidth, maxItemWidth]);

  useEffect(() => {
    const chunkSize = itemsPerSlide * 2;
    const chunks: TrendingTopicsType[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    setSlideData(chunks);
  }, [itemsPerSlide, data]);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <CarouselSection title="Latest creators" action={<NavigationArrows next={carousel.onNext} prev={carousel.onPrev} />}>
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

type SlideProps = {
  items: TrendingTopicsType[];
  itemsPerRow: number;
};

function Slide({ items, itemsPerRow }: SlideProps) {
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
              }}
            >
              <PosterCreators
                id={item.id}
                title={item.title}
                desc={item.desc}
                image={item.image}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
