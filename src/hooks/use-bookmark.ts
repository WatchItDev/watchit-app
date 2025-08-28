import { useMemo } from 'react';
import { useGetUserBookmarksQuery } from '@src/graphql/generated/hooks';
import { useAuth } from '@src/hooks/use-auth';
import { Post } from '@src/graphql/generated/graphql.ts';

export function useBookmarks() {
  const { session } = useAuth();
  const address = session?.address ?? '';

  const { data, loading, refetch } = useGetUserBookmarksQuery({
    variables: { address, limit: 100 },
    skip: !address,
  });

  const idSet = useMemo(() => {
    if (!data?.getUserBookmarks) return new Set<string>();
    return new Set(data.getUserBookmarks.map((p: Post) => p.id));
  }, [data]);

  return {
    loading,
    has: (postId: string) => idSet.has(postId),
    data: data?.getUserBookmarks ?? [],
    refetch,
  };
}
