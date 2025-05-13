import { ExploreProfilesOrderByType, LimitType, useExploreProfiles } from '@lens-protocol/react-web';
import CarouselCreators from '@src/components/carousel/variants/carousel-creators.tsx';
import { filterHiddenProfiles } from '@src/libs/profile.ts';
import {useEffect} from "react"
import {setExploreLoading} from "@redux/loading"
import { useDispatch } from 'react-redux';


// ----------------------------------------------------------------------

export const ExploreCreators = () => {
  const dispatch = useDispatch();
  const { data: latestCreatedProfiles, loading } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.LatestCreated,
    limit: LimitType.Fifty,
  });

  // console.log('latestCreatedProfiles', latestCreatedProfiles);

  // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
  const filtered = latestCreatedProfiles?.filter(
    (profile) => profile.metadata?.displayName && profile.metadata?.bio
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
