import React from 'react';
import Carousel from 'react-slick';

import { describe, it, expect } from 'vitest';

import {
  NavigationArrowsProps,
  CarouselDotsStyledRootProps,
  CarouselArrowsStyledIconButtonProps,
  CarouselArrowsProps,
  CarouselArrowIndexProps,
  ArrowIconProps,
} from '../types';
import {CarouselReturnType} from "@src/hooks/components/types.ts";

describe('CarouselReturnType', () => {
  it('should have correct default values', () => {
    const carouselRef = React.createRef<Carousel>();
    const carouselReturnType: CarouselReturnType = {
      currentIndex: 0,
      nav: undefined,
      carouselSettings: {},
      carouselRef,
      onPrev: () => {},
      onNext: () => {},
      onSetNav: () => {},
      onTogo: () => {},
      setNav: () => {},
      setCurrentIndex: () => {},
    };

    expect(carouselReturnType.currentIndex).toBe(0);
    expect(carouselReturnType.nav).toBeUndefined();
    expect(carouselReturnType.carouselRef).toBe(carouselRef);
  });
});

describe('NavigationArrowsProps', () => {
  it('should have next and prev functions', () => {
    const props: NavigationArrowsProps = {
      next: () => {},
      prev: () => {},
    };

    expect(typeof props.next).toBe('function');
    expect(typeof props.prev).toBe('function');
  });
});

describe('CarouselDotsStyledRootProps', () => {
  it('should have rounded property', () => {
    const props: CarouselDotsStyledRootProps = {
      rounded: true,
    };

    expect(props.rounded).toBe(true);
  });
});

describe('CarouselArrowsStyledIconButtonProps', () => {
  it('should have optional properties', () => {
    const props: CarouselArrowsStyledIconButtonProps = {
      filled: true,
      shape: 'circular',
      hasChild: true,
    };

    expect(props.filled).toBe(true);
    expect(props.shape).toBe('circular');
    expect(props.hasChild).toBe(true);
  });
});

describe('CarouselArrowsProps', () => {
  it('should have optional properties and children', () => {
    const props: CarouselArrowsProps = {
      shape: 'rounded',
      filled: true,
      children: <div>Child</div>,
      icon:  '<path d="90"/>',
      onNext: () => {},
      onPrev: () => {},
      leftButtonProps: { color: 'primary' },
      rightButtonProps: { color: 'secondary' },
    };

    expect(props.shape).toBe('rounded');
    expect(props.filled).toBe(true);
    expect(props.children).toBeDefined();
    expect(props.icon).toBe('<path d="90"/>');
    expect(typeof props.onNext).toBe('function');
    expect(typeof props.onPrev).toBe('function');
    expect(props.leftButtonProps?.color).toBe('primary');
    expect(props.rightButtonProps?.color).toBe('secondary');
  });
});

describe('CarouselArrowIndexProps', () => {
  it('should have index and total properties', () => {
    const props: CarouselArrowIndexProps = {
      index: 1,
      total: 5,
      icon:  '<path d="90"/>',
      onNext: () => {},
      onPrev: () => {},
      sx: { margin: 1 },
    };

    expect(props.index).toBe(1);
    expect(props.total).toBe(5);
    expect(props.icon).toBe('<path d="90"/>');
    expect(typeof props.onNext).toBe('function');
    expect(typeof props.onPrev).toBe('function');
    // @ts-ignore
    expect(props.sx?.margin).toBe(1);
  });
});

describe('ArrowIconProps', () => {
  it('should have optional icon and isRTL properties', () => {
    const props: ArrowIconProps = {
      icon:  '<path d="90"/>',
      isRTL: true,
    };

    expect(props.icon).toBe('<path d="90"/>');
    expect(props.isRTL).toBe(true);
  });
});
