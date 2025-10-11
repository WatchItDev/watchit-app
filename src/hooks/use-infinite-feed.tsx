import { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from '@src/graphql/generated/graphql.ts';
import { useGetPostsLazyQuery } from '@src/graphql/generated/hooks.tsx';

export function useInfiniteFeed(pageSize = 24) {
  const [items, setItems] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetchPosts, { loading }] = useGetPostsLazyQuery();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const offset = items.length;

    try {
      const { data } = await fetchPosts({
        variables: {
          input: {},
          getPostsPage2: { limit: pageSize, offset },
        },
        fetchPolicy: 'cache-and-network',
      });

      const next = data?.getPosts ?? [];

      if (!next.length) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...next]);

      if (next.length < pageSize) {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  }, [fetchPosts, hasMore, items.length, loading, pageSize]);

  useEffect(() => {
    if (items.length === 0 && hasMore && !loading) {
      void loadMore();
    }
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
