import CarouselTopTitles from '@src/components/carousel/variants/carousel-top-titles.tsx';
import { useGetRecentPostsQuery } from '@src/graphql/generated/hooks.tsx';
import { ExploreTopPublicationsSkeleton } from '@src/sections/explore/components/explore-top-publications.skeleton.tsx';
import { LoadingFade } from '@src/components/LoadingFade.tsx';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const { data: allData, loading } = useGetRecentPostsQuery({
    variables: { limit: 10 },
  });

  return (
    <LoadingFade
      loading={loading}
      skeleton={<ExploreTopPublicationsSkeleton />}
    >
      <CarouselTopTitles posts={allData?.getRecentPosts ?? []} />
    </LoadingFade>
  );
};
