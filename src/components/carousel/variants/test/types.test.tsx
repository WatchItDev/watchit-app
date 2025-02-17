import { describe, it, expect } from 'vitest';
import { CarouselWrapperProps } from '../types';

describe('CarouselWrapperProps', () => {
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
