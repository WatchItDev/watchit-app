import React from "react";
import Carousel, {Settings} from "react-slick";
import {IconButtonProps} from "@mui/material/IconButton";
import {StackProps} from "@mui/material/Stack";
import {IconifyProps} from "@src/components/iconify";
import {SxProps, Theme} from "@mui/material/styles";

export type CarouselReturnType = {
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
};

export interface NavigationArrowsProps {
  next: () => void;
  prev: () => void;
}

export type CarouselDotsStyledRootProps = {
  rounded: boolean;
};

export interface CarouselArrowsStyledIconButtonProps extends IconButtonProps {
  filled?: boolean;
  shape?: 'circular' | 'rounded';
  hasChild?: boolean;
}

export interface CarouselArrowsProps extends StackProps {
  shape?: 'circular' | 'rounded';
  filled?: boolean;
  children?: React.ReactNode;
  icon?: IconifyProps; // Right icon
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
  leftButtonProps?: IconButtonProps;
  rightButtonProps?: IconButtonProps;
}

export type CarouselArrowIndexProps = {
  index: number;
  total: number;
  icon?: IconifyProps; // Right icon
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
  sx?: SxProps<Theme>;
};

export type ArrowIconProps = {
  icon?: IconifyProps; // Right icon
  isRTL?: boolean;
};
