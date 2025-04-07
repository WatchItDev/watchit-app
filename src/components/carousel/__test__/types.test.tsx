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
  CarouselCreatorsProps,
  CarouselPosterSlideProps,
  PublicationType, CarouselTopTitlesProps, CarouselPosterMiniProps,
} from '../types.ts';
import {CarouselReturnType} from "@src/hooks/components/types";
import {CarouselWrapperProps} from "@src/components/carousel/types";

describe('[TYPES]: CarouselReturnType', () => {
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

describe('[TYPES]: NavigationArrowsProps', () => {
  it('should have next and prev functions', () => {
    const props: NavigationArrowsProps = {
      next: () => {},
      prev: () => {},
    };

    expect(typeof props.next).toBe('function');
    expect(typeof props.prev).toBe('function');
  });
});

describe('[TYPES]: CarouselDotsStyledRootProps', () => {
  it('should have rounded property', () => {
    const props: CarouselDotsStyledRootProps = {
      rounded: true,
    };

    expect(props.rounded).toBe(true);
  });
});

describe('[TYPES]: CarouselArrowsStyledIconButtonProps', () => {
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

describe('[TYPES]: CarouselArrowsProps', () => {
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

describe('[TYPES]: CarouselArrowIndexProps', () => {
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
    // @ts-expect-error No error in this context
    expect(props.sx?.margin).toBe(1);
  });
});

describe('[TYPES]: ArrowIconProps', () => {
  it('should have optional icon and isRTL properties', () => {
    const props: ArrowIconProps = {
      icon:  '<path d="90"/>',
      isRTL: true,
    };

    expect(props.icon).toBe('<path d="90"/>');
    expect(props.isRTL).toBe(true);
  });
});

describe('[TYPES]: CarouselWrapperProps', () => {
  it('should have data, minItemWidth, maxItemWidth, renderSlide, and carouselSettings properties', () => {
    const props: CarouselWrapperProps<any> = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
      renderSlide: (_slideItems, _itemsPerRow, index) => <div key={index}>{index}</div>,
      carouselSettings: {},
    };

    expect(props.data).toBeInstanceOf(Array);
    expect(props.minItemWidth).toBe(100);
    expect(props.maxItemWidth).toBe(200);
    expect(typeof props.renderSlide).toBe('function');
    expect(props.carouselSettings).toBeInstanceOf(Object);
  });

  it('should have optional title, boxStyle, and boxClassName properties', () => {
    const props: CarouselWrapperProps<any> = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
      renderSlide: (_slideItems, _itemsPerRow, index) => <div key={index}>{index}</div>,
      carouselSettings: {},
      title: 'Test Title',
      boxStyle: { backgroundColor: 'red' },
      boxClassName: 'test-class',
    };

    expect(props.title).toBe('Test Title');
    expect(props.boxStyle).toEqual({ backgroundColor: 'red' });
    expect(props.boxClassName).toBe('test-class');
  });
});

describe('[TYPES]: CarouselCreatorsProps', () => {
  it('should have data, minItemWidth, maxItemWidth properties', () => {
    const props: CarouselCreatorsProps = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
    };

    expect(props.data).toBeInstanceOf(Array);
    expect(props.minItemWidth).toBe(100);
    expect(props.maxItemWidth).toBe(200);
  });

  it('should have optional title property', () => {
    const props: CarouselCreatorsProps = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
      title: 'Test Title',
    };

    expect(props.title).toBe('Test Title');
  });
});

describe('CarouselPosterMiniProps', () => {
  it('should have data, minItemWidth, maxItemWidth properties', () => {
    const props: CarouselPosterMiniProps = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
    };

    expect(props.data).toBeInstanceOf(Array);
    expect(props.minItemWidth).toBe(100);
    expect(props.maxItemWidth).toBe(200);
  });

  it('should have optional title property', () => {
    const props: CarouselPosterMiniProps = {
      data: [],
      minItemWidth: 100,
      maxItemWidth: 200,
      title: 'Test Title',
    };

    expect(props.title).toBe('Test Title');
  });
});

describe('CarouselTopTitlesProps', () => {
  it('should have posts property', () => {
    const props: CarouselTopTitlesProps = {
      posts: [],
    };

    expect(props.posts).toBeInstanceOf(Array);
  });

  it('should have optional category property', () => {
    const props: CarouselTopTitlesProps = {
      posts: [],
      category: 'Test Category',
    };

    expect(props.category).toBe('Test Category');
  });
});

describe('CarouselPosterSlideProps', () => {
  it('should have items and itemsPerRow properties', () => {
    const props: CarouselPosterSlideProps = {
      items: [],
      itemsPerRow: 3,
    };

    expect(props.items).toBeInstanceOf(Array);
    expect(props.itemsPerRow).toBe(3);
  });
});

describe('PublicationType', () => {
  it('should have altTag and metadata properties', () => {
    const props: PublicationType = {
      altTag: 'Test Alt Tag',
      metadata: { title: 'Test Title' },
    };

    expect(props.altTag).toBe('Test Alt Tag');
    expect(props.metadata).toBeDefined();
  });
});
