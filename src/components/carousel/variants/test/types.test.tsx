import { describe, it, expect } from 'vitest';
import { CarouselSlideProps, CarouselCreatorsProps, CarouselPosterMiniProps, CarouselTopTitlesProps } from '../types';
import { Profile } from '@lens-protocol/api-bindings';
// @ts-ignore
import { Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';

describe('CarouselSlideProps', () => {
  it('should have items and itemsPerRow properties', () => {
    const props: CarouselSlideProps = {
      items: [] as Profile[],
      itemsPerRow: 3,
    };

    expect(props.items).toBeInstanceOf(Array);
    expect(props.itemsPerRow).toBe(3);
  });
});

describe('CarouselCreatorsProps', () => {
  it('should have data, minItemWidth, and maxItemWidth properties', () => {
    const props: CarouselCreatorsProps = {
      data: [] as Profile[],
      minItemWidth: 100,
      maxItemWidth: 200,
    };

    expect(props.data).toBeInstanceOf(Array);
    expect(props.minItemWidth).toBe(100);
    expect(props.maxItemWidth).toBe(200);
  });

  it('should have an optional title property', () => {
    const props: CarouselCreatorsProps = {
      data: [] as Profile[],
      minItemWidth: 100,
      maxItemWidth: 200,
      title: 'Test Title',
    };

    expect(props.title).toBe('Test Title');
  });
});

describe('CarouselPosterMiniProps', () => {
  it('should have data, minItemWidth, and maxItemWidth properties', () => {
    const props: CarouselPosterMiniProps = {
      data: [] as Post[],
      minItemWidth: 100,
      maxItemWidth: 200,
    };

    expect(props.data).toBeInstanceOf(Array);
    expect(props.minItemWidth).toBe(100);
    expect(props.maxItemWidth).toBe(200);
  });

  it('should have an optional title property', () => {
    const props: CarouselPosterMiniProps = {
      data: [] as Post[],
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
      posts: [] as Post[],
    };

    expect(props.posts).toBeInstanceOf(Array);
  });

  it('should have an optional category property', () => {
    const props: CarouselTopTitlesProps = {
      posts: [] as Post[],
      category: 'Test Category',
    };

    expect(props.category).toBe('Test Category');
  });
});
