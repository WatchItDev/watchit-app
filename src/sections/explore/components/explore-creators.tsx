import CarouselCreators from '@src/components/carousel/variants/carousel-creators.tsx';
import { filterHiddenProfiles } from '@src/libs/profile.ts';
import { useGetRecentUsersQuery } from '@src/graphql/generated/hooks.tsx';
import { User } from '@src/graphql/generated/graphql.ts';
import { ExploreCreatorsSkeleton } from '@src/sections/explore/components/explore-creators.skeleton.tsx';
import { LoadingFade } from '@src/components/LoadingFade.tsx';

// ----------------------------------------------------------------------

export const ExploreCreators = () => {
  const { data, loading } = useGetRecentUsersQuery({ variables: { limit: 50 } })

  // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
  const filtered = data?.getRecentUsers?.filter(
    (profile: User) => profile?.displayName && profile?.bio
  );

  // Clear ###HIDDEN### profiles
  const filteredProfiles = filterHiddenProfiles(filtered);

  return (
    <LoadingFade loading={loading} skeleton={<ExploreCreatorsSkeleton />} delayMs={500}>
      {!!filteredProfiles?.length && (
        <CarouselCreators
          profiles={filteredProfiles}
          title="Latest creators"
          minItemWidth={250}
          maxItemWidth={400}
        />
      )}
    </LoadingFade>
  );
}
