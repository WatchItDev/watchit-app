import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetPostsLazy } from '@src/graphql/hooks/post';
import type { NormalizedPost } from '@src/utils/post-normalizer';

export function useInfiniteFeed(pageSize = 24) {
  const [items, setItems] = useState<NormalizedPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetchPosts, { loading }] = useGetPostsLazy();
  const [offset, setOffset] = useState(0);
  const [isRecycling, setIsRecycling] = useState(false);
  const baseItemsRef = useRef<NormalizedPost[]>([]);
  const recycleCursorRef = useRef(0);

  const beginRecycling = useCallback(() => {
    recycleCursorRef.current = 0;
    setIsRecycling(true);
  }, []);

  const appendRepeats = useCallback(() => {
    const base = baseItemsRef.current;
    if (!base.length) return;

    const chunkSize = Math.min(pageSize, base.length);
    if (!chunkSize) return;

    const chunk: NormalizedPost[] = [];
    for (let i = 0; i < chunkSize; i += 1) {
      const idx = (recycleCursorRef.current + i) % base.length;
      chunk.push(base[idx]);
    }
    recycleCursorRef.current = (recycleCursorRef.current + chunkSize) % base.length;
    setItems((prev) => [...prev, ...chunk]);
  }, [pageSize]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    if (isRecycling) {
      appendRepeats();
      return;
    }

    try {
      const currentOffset = offset;
      const next = await fetchPosts({
        input: {},
        page: { limit: pageSize, offset: currentOffset },
      });

      if (!next.length) {
        if (!baseItemsRef.current.length) {
          setHasMore(false);
          return;
        }
        beginRecycling();
        appendRepeats();
        return;
      }

      baseItemsRef.current = baseItemsRef.current.concat(next);
      setItems((prev) => [...prev, ...next]);
      setOffset((prev) => prev + next.length);

      if (next.length < pageSize) {
        beginRecycling();
      }
    } catch (error) {
      console.error('useInfiniteFeed error', error);
      if (!baseItemsRef.current.length) {
        setHasMore(false);
      } else {
        beginRecycling();
        appendRepeats();
      }
    }
  }, [
    appendRepeats,
    beginRecycling,
    fetchPosts,
    hasMore,
    isRecycling,
    loading,
    offset,
    pageSize,
  ]);

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
