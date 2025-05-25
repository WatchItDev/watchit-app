import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini.tsx';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useGetRecentPostsQuery } from '@src/graphql/generated/hooks.tsx';
import { ExplorePublicationsSkeleton } from '@src/sections/explore/components/explore-publications.skeleton.tsx';
import { LoadingFade } from '@src/components/LoadingFade.tsx';

// ----------------------------------------------------------------------

export const ExplorePublications = () => {
  const lgUp = useResponsive('up', 'lg');
  const { data, loading } = useGetRecentPostsQuery({ variables: { limit: 100 } })

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  return (
    <LoadingFade loading={loading} skeleton={<ExplorePublicationsSkeleton />}>
      <CarouselPosterMini
        data={data?.getRecentPosts ?? []}
        title="Publications"
        minItemWidth={minItemWidth}
        maxItemWidth={maxItemWidth}
      />
    </LoadingFade>
  );
}
