import CarouselTopTitles from '@src/components/carousel/variants/CarouselTopTitles.tsx';
import {
  appId,
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationType,
  useExplorePublications,
  usePublications,
} from '@lens-protocol/react-web';
import { ExploreTopPublicationsSkeleton } from '@src/sections/explore/components/explore-top-publications.skeleton.tsx';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const { data, loading } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });
  const { data: explorePublications } = useExplorePublications({
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
    limit: LimitType.Ten,
    orderBy: ExplorePublicationsOrderByType.TopCommented,
  });

  if (loading) return <ExploreTopPublicationsSkeleton/>;

  const combinedPosts = [...(explorePublications ?? []), ...(data ?? [])]
    .filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
    .slice(0, 10);

  return (
    <CarouselTopTitles posts={combinedPosts} />
  );
}
