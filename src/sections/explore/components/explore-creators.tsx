import CarouselCreators from '@src/components/carousel/variants/carousel-creators.tsx';
import { filterHiddenProfiles } from '@src/libs/profile.ts';
import {useEffect} from "react"
import {setExploreLoading} from "@redux/loading"
import { useDispatch } from 'react-redux';
import { useGetRecentUsersQuery } from '@src/graphql/generated/hooks.tsx';
import { User } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export const ExploreCreators = () => {
  const dispatch = useDispatch();
  const { data, loading } = useGetRecentUsersQuery({ variables: { limit: 50 } })

  // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
  const filtered = data?.getRecentUsers?.filter(
    (profile: User) => profile?.displayName && profile?.bio
  );

  // Clear ###HIDDEN### profiles
  const filteredProfiles = filterHiddenProfiles(filtered);

  useEffect(() => {
    dispatch(setExploreLoading({ key: 'creators', isLoading: loading }));
  }, [dispatch, loading])

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
