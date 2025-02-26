import React from "react";

import {Profile, VideoMetadataV3} from "@lens-protocol/api-bindings";
// @ts-ignore
import { Post,PublicationMetadataMediaVideoFieldPolicy } from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";

import {StackProps} from "@mui/material/Stack";
import {IconButtonProps} from "@mui/material/IconButton";

import {BoxProps} from "@mui/material/Box";
import {SxProps, Theme} from "@mui/material/styles";
import {IconifyProps} from "@src/components/iconify";


export interface CarouselDotsProps extends BoxProps {
  rounded?: boolean;
  sx?: SxProps<Theme>;
}

interface CarouselNavigationActions {
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
}

export type ArrowIconProps = {
  icon?: IconifyProps;
  isRTL?: boolean;
};

export type CarouselArrowIndexProps = CarouselNavigationActions & {
  index: number;
  total: number;
  icon?: IconifyProps;
  sx?: SxProps<Theme>;
};

export interface CarouselArrowsProps extends StackProps, CarouselNavigationActions {
  shape?: 'circular' | 'rounded';
  filled?: boolean;
  children?: React.ReactNode;
  icon?: IconifyProps; // Right icon
  leftButtonProps?: IconButtonProps;
  rightButtonProps?: IconButtonProps;
}

export interface CarouselArrowsStyledIconButtonProps extends IconButtonProps {
  filled?: boolean;
  shape?: 'circular' | 'rounded';
  hasChild?: boolean;
}

export interface NavigationArrowsProps {
  next: () => void;
  prev: () => void;
}

export type CarouselDotsStyledRootProps = {
  rounded: boolean;
};

interface CarouselResizable {
  minItemWidth: number;
  maxItemWidth: number;
}

export interface CarouselWrapperProps<T> extends CarouselResizable{
  data: T[];
  title?: string;
  renderSlide: (slideItems: T[], itemsPerRow: number, index: number) => React.ReactNode;
  carouselSettings: any;
  boxStyle?: any;
  boxClassName?: string;
}

export interface CarouselSlideProps<T> {
  items: T[];
  itemsPerRow: number;
  renderItem: (item: T) => React.ReactNode;
}

export type CarouselCreatorsProps = CarouselResizable & {
  data: Profile[];
  title?: string;
};

export type CarouselPosterMiniProps = CarouselResizable & {
  data: Post[];
  title?: string;
};

export type CarouselTopTitlesProps = {
  posts: Post[];
  category?: string;
};

export type CarouselPosterSlideProps = {
  items: Post[];
  itemsPerRow: number;
};

export interface PublicationType extends Post {
  altTag: string;
  metadata: VideoMetadataV3 | PublicationMetadataMediaVideoFieldPolicy;
}
