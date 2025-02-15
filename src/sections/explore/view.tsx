// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// COMPONENTS IMPORTS
import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini';
// LENS IMPORTS
import {
  appId,
  ExploreProfilesOrderByType,
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationType,
  useBookmarks,
  useExploreProfiles,
  useExplorePublications,
  usePublications,
} from '@lens-protocol/react-web';

// LOCAL IMPORTS
import { LoadingScreen } from '@src/components/loading-screen';
import CarouselTopTitles from '@src/components/carousel/variants/carousel-top-titles.tsx';
import CarouselCreators from '@src/components/carousel/variants/carousel-creators.tsx';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export type TrendingTopicsType = {
  id: number;
  image: string;
  title: string;
  desc: string;
};

export default function ExploreView() {
  const lgUp = useResponsive('up', 'lg');
  const { bookmarkPublications, hiddenBookmarks } = useSelector((state: any) => state.bookmark);

  let minItemWidth = 250;
  let maxItemWidth = 350;

  if (!lgUp) {
    minItemWidth = 170;
    maxItemWidth = 250;
  }

  const { data: bookmark } = useBookmarks();
  const { data, loading }: any = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });


  const { data: latestCreatedProfiles } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.LatestCreated,
    limit: LimitType.Fifty,
  });

  console.log('repeat')
  console.log(latestCreatedProfiles)

  // FilteredCompletedProfiles is an array of objects, each object has a metadata property and inside exists a displayName en bio property; filter the profiles that not have a displayName and bio property
  const filteredProfiles = latestCreatedProfiles?.filter(
    (profile: any) => profile.metadata?.displayName && profile.metadata?.bio
  );

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

  if (loading) return <LoadingScreen />;

  const combinedPosts = [...(explorePublications ?? []), ...(data ?? [])]
    .filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
    .slice(0, 10);

  // @TODO Uncomment the following line to insert publications in supabase when needed
  // InsertMoviesSupabase(explorePublications);

  const bookmarksFiltered = [...[...bookmarkPublications].reverse(), ...(bookmark ?? [])]
    .filter((post) => !hiddenBookmarks.some((hidden: any) => hidden.id === post.id))
    .filter((post) => !post.isHidden)
    .filter((post, index, self) => index === self.findIndex((p) => p.id === post.id));

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack direction={'column'} spacing={1} sx={{ maxWidth: '100vw !important' }}>
        <CarouselTopTitles posts={combinedPosts} />

        {!!bookmarksFiltered?.length && (
          <CarouselPosterMini
            data={bookmarksFiltered ?? []}
            title="Bookmarks"
            minItemWidth={minItemWidth}
            maxItemWidth={maxItemWidth}
          />
        )}

        <CarouselCreators
          data={filteredProfiles ?? []}
          title="Latest creators"
          minItemWidth={250}
          maxItemWidth={400}
        />

        <CarouselPosterMini
          data={data ?? []}
          title="Publications"
          minItemWidth={minItemWidth}
          maxItemWidth={maxItemWidth}
        />
      </Stack>
    </Container>
  );
}
