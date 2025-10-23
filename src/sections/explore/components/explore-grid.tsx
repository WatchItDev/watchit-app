import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetGrid, setItems } from '@redux/grid';
import VirtualizedGrid from './grid/virtualized-grid';
import { useInfiniteFeed } from '@src/hooks/use-infinite-feed';
import type { NormalizedPost } from '@src/utils/post-normalizer';
import { postsToGridItems } from './explore-grid.utils';

/** Entry point that wires the feed with the virtualized explore grid. */
export default function ExploreGrid() {
  const dispatch = useDispatch();
  const { items: posts, sentinelRef } = useInfiniteFeed(30);
  const previousPostsRef = useRef<NormalizedPost[] | null>(null);

  useEffect(() => {
    dispatch(resetGrid());
  }, [dispatch]);

  useEffect(() => {
    if (!posts?.length) return;
    if (previousPostsRef.current === posts) return;
    previousPostsRef.current = posts;
    const next = postsToGridItems(posts, 120);
    dispatch(setItems(next));
  }, [posts, dispatch]);

  return (
    <Box sx={{ height: '100%', maxHeight: '100%' }}>
      <VirtualizedGrid sentinelRef={sentinelRef} />
      {/* opcional: indicador externo de loading con `loading` */}
    </Box>
  );
}
