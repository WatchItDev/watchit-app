import type { Post } from '@src/graphql/generated/graphql';
import { normalizePost } from '@src/utils/post-normalizer';
import type { GridItem as GridItemType } from '../types';

// ---- Sliders programados (conservados) ----
export const SLIDERS = [
  { id: 'top-picks', after: 3, w: 2, h: 2 },
  { id: 'continue-watching', after: 12, w: 2, h: 2 },
  { id: 'popular-week', after: 22, w: 2, h: 2 },
  { id: 'comedy', after: 35, w: 2, h: 2 },
  { id: 'region', after: 48, w: 2, h: 2 },
  { id: 'interest', after: 60, w: 2, h: 2 },
];

export function repeatUntil<T>(arr: T[], min: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length >= min) return arr.slice(0, min);
  const out: T[] = [];
  let i = 0;
  while (out.length < min) {
    out.push(arr[i % arr.length]);
    i += 1;
  }
  return out;
}

export function postsToGridItems(posts: Post[], minRegularCount = 120): GridItemType[] {
  const enriched = posts.map((post) => normalizePost(post));
  const basePosts = repeatUntil(enriched, Math.max(minRegularCount, enriched.length));
  const items: GridItemType[] = [];
  let sliderIndex = 0;
  const sliders = [...SLIDERS].sort((a, b) => a.after - b.after);

  basePosts.forEach((post, i) => {
    items.push({
      id: `post-${post.id}#${i}`,
      type: 'regular',
      color: '#000',
      title: post.title ?? '',
      dimensions: { width: 1, height: 1 },
      position: { x: 0, y: 0 },
      data: { post },
    });

    while (sliderIndex < sliders.length && sliders[sliderIndex].after === i) {
      const slider = sliders[sliderIndex++];
      items.push({
        id: `slider-${slider.id}`,
        type: 'slider',
        color: 'transparent',
        title: slider.id,
        dimensions: { width: slider.w, height: slider.h },
        position: { x: 0, y: 0 },
        data: { sliderId: slider.id },
      });
    }
  });

  while (sliderIndex < sliders.length) {
    const slider = sliders[sliderIndex++];
    items.push({
      id: `slider-${slider.id}`,
      type: 'slider',
      color: 'transparent',
      title: slider.id,
      dimensions: { width: slider.w, height: slider.h },
      position: { x: 0, y: 0 },
      data: { sliderId: slider.id },
    });
  }

  return items;
}
