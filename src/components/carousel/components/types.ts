import {BoxProps} from "@mui/material/Box";
import {SxProps, Theme} from "@mui/material/styles";
import {IconifyProps} from "@src/components/iconify";
import {StackProps} from "@mui/material/Stack";
import React from "react";
import {IconButtonProps} from "@mui/material/IconButton";

export interface CarouselDotsProps extends BoxProps {
  rounded?: boolean;
  sx?: SxProps<Theme>;
}

export type ArrowIconProps = {
  icon?: IconifyProps; // Right icon
  isRTL?: boolean;
};

export type CarouselArrowIndexProps = {
  index: number;
  total: number;
  icon?: IconifyProps; // Right icon
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

