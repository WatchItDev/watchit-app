import { useMemo } from 'react';
import { useGetPostsQuery } from '@src/graphql/generated/hooks.tsx';
import { normalizePost } from '@src/utils/post-normalizer';

export function useSliderPosts(limit: number, offset = 0) {
  const { data, loading } = useGetPostsQuery({
    variables: {
      input: {} as any,
      getPostsPage2: { limit, offset },
    },
    fetchPolicy: 'cache-first',
  });

  const posts = useMemo(() => {
    const raw = data?.getPosts ?? [];
    return raw.map(normalizePost);
  }, [data?.getPosts]);

  return { posts, loading } as const;
}
