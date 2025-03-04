import { ExploreProfilesOrderByType, LimitType, useExploreProfiles } from '@lens-protocol/react-web';
import CarouselCreators from '@src/components/carousel/variants/CarouselCreators.tsx';
import { filterHiddenProfiles } from '@src/utils/profile.ts';
import { ExploreCreatorsSkeleton } from '@src/sections/explore/components/explore-creators.skeleton.tsx';

// ----------------------------------------------------------------------

export const ExploreCreators = () => {
  const { data: latestCreatedProfiles, loading } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.LatestCreated,
    limit: LimitType.Fifty,
  });

  // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
  const filtered = latestCreatedProfiles?.filter(
    (profile) => profile.metadata?.displayName && profile.metadata?.bio
  );

  // Clear ###HIDDEN### profiles
  const filteredProfiles = filterHiddenProfiles(filtered);

  if (loading) return <ExploreCreatorsSkeleton />;

  return (
    <>
      {!!filteredProfiles?.length && (
        <CarouselCreators
          profiles={filteredProfiles}
          title="Latest creators"
          minItemWidth={250}
          maxItemWidth={400}
        />
      )}
    </>
  );
}
