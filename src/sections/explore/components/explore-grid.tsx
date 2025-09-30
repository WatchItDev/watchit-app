import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addItems, resetGrid } from '@redux/grid';
import type { GridItem as GridItemType } from '../types';
import type { Post } from '@src/graphql/generated/graphql';

// ✅ Importa el grid correcto (evita el de demo)
import VirtualizedGrid from './grid/virtualized-grid';

import { useInfiniteFeed } from '@src/hooks/use-infinite-feed';

// ---- Sliders programados (conservados) ----
const SLIDERS = [
  { id: 'top-picks',         after: 3,  w: 2, h: 2 },
  { id: 'continue-watching', after: 12, w: 2, h: 2 },
  { id: 'popular-week',      after: 22, w: 2, h: 2 },
  { id: 'comedy',            after: 35, w: 2, h: 2 },
  { id: 'region',            after: 48, w: 2, h: 2 },
  { id: 'interest',          after: 60, w: 2, h: 2 },
];

function repeatUntil<T>(arr: T[], min: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length >= min) return arr.slice(0, min);
  const out: T[] = [];
  let i = 0;
  while (out.length < min) { out.push(arr[i % arr.length]); i++; }
  return out;
}

function postsToGridItems(posts: Post[], minRegularCount = 120): GridItemType[] {
  const basePosts = repeatUntil(posts, Math.max(minRegularCount, posts.length));
  const items: GridItemType[] = [];
  let si = 0;
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

    while (si < sliders.length && sliders[si].after === i) {
      const s = sliders[si++];
      items.push({
        id: `slider-${s.id}`,
        type: 'slider',
        color: 'transparent',
        title: s.id,
        dimensions: { width: s.w, height: s.h },
        position: { x: 0, y: 0 },
        data: { sliderId: s.id },
      });
    }
  });

  while (si < sliders.length) {
    const s = sliders[si++];
    items.push({
      id: `slider-${s.id}`,
      type: 'slider',
      color: 'transparent',
      title: s.id,
      dimensions: { width: s.w, height: s.h },
      position: { x: 0, y: 0 },
      data: { sliderId: s.id },
    });
  }
  return items;
}

export default function ExploreGrid() {
  const dispatch = useDispatch();
  const { items: posts, loading, sentinelRef } = useInfiniteFeed(30);

  useEffect(() => {
    dispatch(resetGrid());
  }, [dispatch]);

  useEffect(() => {
    if (!posts?.length) return;
    const next = postsToGridItems(posts, 120);
    dispatch(addItems(next));
  }, [posts, dispatch]);

  return (
    <Box sx={{ p: 2 }}>
      <VirtualizedGrid sentinelRef={sentinelRef} />
      {/* opcional: indicador externo de loading con `loading` */}
    </Box>
  );
}
