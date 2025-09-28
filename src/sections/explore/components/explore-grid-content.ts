import type { Post } from '@src/graphql/generated/graphql';
import type { GridItem, SliderConfig } from '@src/sections/explore/types';
import { EXPLORE_SLIDERS, FEED_MIN_REGULAR_COUNT } from '@src/sections/explore/CONSTANTS';

/**
 * Expands the provided array until reaching the desired minimum length, cycling the original values.
 */
export function repeatUntil<T>(arr: T[], min: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length >= min) return arr.slice(0, min);
  const out: T[] = [];
  let i = 0;
  while (out.length < min) {
    out.push(arr[i % arr.length]);
    i++;
  }
  return out;
}

/**
 * Translates GraphQL posts into grid items while interleaving the scheduled slider entries.
 */
export function postsToGridItems(
  posts: Post[],
  minRegularCount: number = FEED_MIN_REGULAR_COUNT,
  sliders: SliderConfig[] = EXPLORE_SLIDERS,
): GridItem[] {
  const basePosts = repeatUntil(posts, Math.max(minRegularCount, posts.length));
  const items: GridItem[] = [];
  let sliderIndex = 0;
  const sortedSliders = [...sliders].sort((a, b) => a.after - b.after);

  basePosts.forEach((post, index) => {
    items.push({
      id: `post-${post.id}#${index}`,
      type: 'regular',
      color: '#000',
      title: post.title ?? '',
      dimensions: { width: 1, height: 1 },
      position: { x: 0, y: 0 },
      data: { post },
    });

    while (sliderIndex < sortedSliders.length && sortedSliders[sliderIndex].after === index) {
      const slider = sortedSliders[sliderIndex++];
      items.push({
        id: `slider-${slider.id}`,
        type: 'slider',
        color: 'transparent',
        title: slider.id,
        dimensions: { width: slider.span.w, height: slider.span.h },
        position: { x: 0, y: 0 },
        data: { sliderId: slider.id },
      });
    }
  });

  while (sliderIndex < sortedSliders.length) {
    const slider = sortedSliders[sliderIndex++];
    items.push({
      id: `slider-${slider.id}`,
      type: 'slider',
      color: 'transparent',
      title: slider.id,
      dimensions: { width: slider.span.w, height: slider.span.h },
      position: { x: 0, y: 0 },
      data: { sliderId: slider.id },
    });
  }

  return items;
}
