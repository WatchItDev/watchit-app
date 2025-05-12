import CarouselTopTitles from "@src/components/carousel/variants/carousel-top-titles.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setExploreLoading } from "@redux/loading/index.ts";
import { useGetAllPostsQuery, useGetPopularPostsQuery } from '@src/graphql/generated/hooks.tsx';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const dispatch = useDispatch();
  const { data, loading } = useGetAllPostsQuery({ variables: { limit: 10 } })
  const { data: explorePublications, loading: popularLoading } = useGetPopularPostsQuery({ variables: { limit: 10 } })

  // Update loading state in Redux store
  useEffect(() => {
    dispatch(setExploreLoading({ key: "top", isLoading: loading || popularLoading }));
  }, [loading, popularLoading]);

  const combinedPosts = [...(explorePublications?.getPopularPosts ?? []), ...(data?.getAllPosts ?? [])]
    .filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
    .slice(0, 10);

  return <CarouselTopTitles posts={combinedPosts} />;
};
