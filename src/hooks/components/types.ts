import React from "react";
import Carousel, {Settings} from "react-slick";

export interface CarouselReturnType {
  currentIndex: number;
  nav: Carousel | undefined;
  carouselSettings: Settings;
  carouselRef: React.MutableRefObject<Carousel | null>;
  //
  onPrev: VoidFunction;
  onNext: VoidFunction;
  onSetNav: VoidFunction;
  onTogo: (index: number) => void;
  //
  setNav: React.Dispatch<React.SetStateAction<Carousel | undefined>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface UseItemsPerSlideProps {
  minItemWidth: number;
  maxItemWidth: number;
}

export interface UseItemsPerSlideReturn {
  itemsPerSlide: number;
  parentRef: React.RefObject<HTMLDivElement>;
}

