import React from 'react';
import { StackProps } from '@mui/material/Stack';
import { IconButtonProps } from '@mui/material/IconButton';
import { IconifyProps } from '@src/components/iconify';

interface CarouselNavigationActions {
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
}

export interface ArrowIconProps {
  icon?: IconifyProps;
  isRTL?: boolean;
}

export interface CarouselArrowsProps
  extends StackProps,
    CarouselNavigationActions {
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
