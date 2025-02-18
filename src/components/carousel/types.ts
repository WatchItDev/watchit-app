import {BoxProps} from "@mui/material/Box";
import {SxProps, Theme} from "@mui/material/styles";
import {IconifyProps} from "@src/components/iconify";
import {StackProps} from "@mui/material/Stack";
import React from "react";
import {IconButtonProps} from "@mui/material/IconButton";
import {Profile, VideoMetadataV3} from "@lens-protocol/api-bindings";
// @ts-ignore
import { Post,PublicationMetadataMediaVideoFieldPolicy } from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";

export interface CarouselDotsProps extends BoxProps {
  rounded?: boolean;
  sx?: SxProps<Theme>;
}

export type ArrowIconProps = {
  icon?: IconifyProps;
  isRTL?: boolean;
};

export type CarouselArrowIndexProps = {
  index: number;
  total: number;
  icon?: IconifyProps;
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
  sx?: SxProps<Theme>;
};

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

export interface CarouselWrapperProps<T> {
  data: T[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
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

export type CarouselCreatorsProps = {
  data: Profile[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
};

export type CarouselPosterMiniProps = {
  data: Post[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
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
