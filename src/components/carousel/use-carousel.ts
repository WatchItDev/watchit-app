import Carousel, { Settings } from 'react-slick';
import { useRef, useCallback, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {CarouselReturnType} from "@src/components/carousel/types.ts";

// ----------------------------------------------------------------------

export default function useCarousel(props?: Settings): CarouselReturnType {
  const theme = useTheme();

  const carouselRef = useRef<Carousel | null>(null);

  const [currentIndex, setCurrentIndex] = useState(props?.initialSlide || 0);

  const [nav, setNav] = useState<Carousel | undefined>(undefined);

  const rtl = theme.direction === 'rtl';

  const carouselSettings = {
    arrows: false,
    dots: !!props?.customPaging,
    rtl,
    // @ts-ignore
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
    ...props,
    fade: !!(props?.fade && !rtl),
  };

  const onSetNav = useCallback(() => {
    if (carouselRef.current) {
      setNav(carouselRef.current);
    }
  }, []);

  const onPrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.slickPrev();
    }
  }, []);

  const onNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.slickNext();
    }
  }, []);

  const onTogo = useCallback((index: number) => {
    if (carouselRef.current) {
      carouselRef.current.slickGoTo(index);
    }
  }, []);

  return {
    nav,
    carouselRef,
    currentIndex,
    carouselSettings,
    //
    onPrev,
    onNext,
    onTogo,
    onSetNav,
    //
    setNav,
    setCurrentIndex,
  };
}
