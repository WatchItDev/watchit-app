import { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from '@src/graphql/generated/graphql.ts';
import { useGetRecentPostsLazyQuery } from '@src/graphql/generated/hooks.tsx';

export function useInfiniteFeed(pageSize = 24) {
  const [items, setItems] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [fetchPosts, { loading } ] = useGetRecentPostsLazyQuery();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const variables: Record<string, unknown> = { limit: pageSize };
    if (cursor) variables.cursor = cursor;
    if (!cursor) (variables as any).offset = items.length; // fallback offset

    const { data } = await fetchPosts({ variables });
    const next = (data as any)?.getRecentPosts ?? [];

    const nodes: Post[] = Array.isArray(next?.nodes) ? next.nodes : next;
    const nextCursor: string | null = (next?.nextCursor as string) ?? null;
    const more: boolean = typeof next?.hasMore === 'boolean' ? next.hasMore : (nodes?.length ?? 0) === pageSize;

    if (nodes?.length) setItems(prev => [...prev, ...nodes]);
    setCursor(nextCursor);
    setHasMore(more);
  }, [cursor, fetchPosts, hasMore, items.length, loading, pageSize]);

  useEffect(() => { if (items.length === 0) void loadMore(); }, []); // initial load

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) void loadMore(); });
    }, { rootMargin: '1200px 0px 1200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return { items, loading, hasMore, sentinelRef } as const;
}
