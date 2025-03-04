import CarouselPosterMini from '@src/components/carousel/variants/CarouselPosterMini.tsx';

import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';

import { useResponsive } from '@src/hooks/use-responsive.ts';
import { ExplorePublicationsSkeleton } from '@src/sections/explore/components/explore-publications.skeleton.tsx';

// ----------------------------------------------------------------------

export const ExplorePublications = () => {
  const lgUp = useResponsive('up', 'lg');
  const { data, loading } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  if (loading) return <ExplorePublicationsSkeleton />;

  return (
    <CarouselPosterMini
      data={data ?? []}
      title="Publications"
      minItemWidth={minItemWidth}
      maxItemWidth={maxItemWidth}
    />
  );
}
