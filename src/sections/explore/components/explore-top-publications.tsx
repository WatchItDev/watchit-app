import CarouselTopTitles from '@src/components/carousel/variants/carousel-top-titles.tsx';
import {
  appId,
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationType,
  useExplorePublications,
  usePublications,
} from '@lens-protocol/react-web';
import {useEffect} from "react"
import { useDispatch } from 'react-redux';
import { setExploreLoading } from '@redux/loading/index.ts';

// ----------------------------------------------------------------------

export const ExploreTopPublications = () => {
  const dispatch = useDispatch();
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

  // Update loading state in Redux store
  useEffect(() => {
    dispatch(setExploreLoading({ key: 'top', isLoading: loading }));
  }, [loading])

  const combinedPosts = [...(explorePublications ?? []), ...(data ?? [])]
    .filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
    .slice(0, 10);

  return (
    <CarouselTopTitles posts={combinedPosts} />
  );
}
