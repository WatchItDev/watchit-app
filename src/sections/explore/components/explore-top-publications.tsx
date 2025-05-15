import CarouselTopTitles from "@src/components/carousel/variants/carousel-top-titles.tsx";
import { useEffect, useMemo } from 'react';
import { useDispatch } from "react-redux";
import { setExploreLoading } from "@redux/loading/index.ts";
import { useGetPopularPostsQuery, useGetRecentPostsQuery } from '@src/graphql/generated/hooks.tsx';
import { Post } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const dispatch = useDispatch();
  const { data: allData, loading: allLoading } = useGetRecentPostsQuery({ variables: { limit: 20 } });
  const { data: popularData, loading: popularLoading } = useGetPopularPostsQuery({ variables: { limit: 10 } });

  // Update loading state in Redux store
  useEffect(() => {
    dispatch(setExploreLoading({ key: "top", isLoading: allLoading || popularLoading }));
  }, [allLoading, popularLoading]);

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

  return <CarouselTopTitles posts={posts} />;
};
