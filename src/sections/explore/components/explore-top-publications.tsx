import CarouselTopTitles from "@src/components/carousel/variants/carousel-top-titles.tsx";
import { useMemo } from 'react';
import { useGetPopularPostsQuery, useGetRecentPostsQuery } from '@src/graphql/generated/hooks.tsx';
import { Post } from '@src/graphql/generated/graphql.ts';
import { ExploreTopPublicationsSkeleton } from '@src/sections/explore/components/explore-top-publications.skeleton.tsx';
import { LoadingFade } from '@src/components/LoadingFade.tsx';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const { data: allData, loading: allLoading } = useGetRecentPostsQuery({ variables: { limit: 20 } });
  const { data: popularData, loading: popularLoading } = useGetPopularPostsQuery({ variables: { limit: 10 } });
  const loading = allLoading || popularLoading

  const posts = useMemo(() => {
    const popular = popularData?.getPopularPosts ?? [];
    const recent = allData?.getRecentPosts ?? [];
    const limit = 10;

    if (popular.length >= limit) return popular.slice(0, limit);

    const needed = limit - popular.length;
    const fillers = recent
      .filter((p: Post) => !popular.some((pp: Post) => pp.id === p.id))
      .slice(0, needed);

    return [...popular, ...fillers];
  }, [popularData, allData]);

  return (
    <LoadingFade loading={loading} skeleton={<ExploreTopPublicationsSkeleton />}>
      <CarouselTopTitles posts={posts} />
    </LoadingFade>
  );
};
