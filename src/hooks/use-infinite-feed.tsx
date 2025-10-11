import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetPostsLazy } from '@src/graphql/hooks/post';
import type { NormalizedPost } from '@src/utils/post-normalizer';

export function useInfiniteFeed(pageSize = 24) {
  const [items, setItems] = useState<NormalizedPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetchPosts, { loading }] = useGetPostsLazy();
  const [offset, setOffset] = useState(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      const nextOffset = offset + pageSize;
      const next = await fetchPosts({
        input: {},
        page: { limit: pageSize, offset },
      });

      if (!next.length) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...next]);
      setOffset(nextOffset);

      if (next.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('useInfiniteFeed error', error);
      setHasMore(false);
    }
  }, [fetchPosts, hasMore, loading, pageSize, offset]);

  useEffect(() => {
    if (items.length === 0 && hasMore && !loading) void loadMore();
  }, [hasMore, items.length, loadMore, loading]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) void loadMore();
      });
    }, { rootMargin: '1200px 0px 1200px 0px' });

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  return { items, loading, hasMore, sentinelRef } as const;
}
