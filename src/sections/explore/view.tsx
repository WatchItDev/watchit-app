// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { supabase } from '@src/utils/supabase';
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

  const { data, loading }: any = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      },
    },
  });
  const { data: bookmark } = useBookmarks();
  const { data: latestCreatedProfiles } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.LatestCreated,
    limit: LimitType.Fifty,
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

  if (loading) return <LoadingScreen />;

  const combinedPosts = [...(explorePublications ?? []), ...(data ?? [])]
    .filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
    .slice(0, 10);


  // Print in console the publications  (explorePublications)
  // console.log('Publications:', explorePublications);

  // For each publications in explorePublications, insert title and description in publications table hosted in supabase
  async function insertPublications() {
    if (explorePublications) {
      for (const publication of explorePublications) {
        if(!publication.isHidden) {
          const { title, content: description} = publication.metadata;
          const post_id = publication.id;

          // Check if the publication already exists
          const { data: existingPublications, error: selectError } = await supabase
            .from('publications')
            .select('id')
            .eq('post_id', post_id);

          if (selectError) {
            console.error('Error checking existing publication:', selectError);
            continue;
          }

          // If the publication does not exist, insert it
          if (existingPublications.length === 0) {
            const { error: insertError } = await supabase
              .from('publications')
              .insert([{ title, description, post_id}]);

            if (insertError) {
              console.error('Error inserting publication:', insertError);
            }
          }
        }
      }
    }
  }
  // @TODO Uncomment the following line to insert publications in supabase when needed
  /*insertPublications().then((data) => {
    console.log('Inserted publications:', data);
  });*/






  const bookmarksFiltered = [...[...bookmarkPublications].reverse(), ...(bookmark ?? [])]
    .filter((post) => !hiddenBookmarks.some((hidden: any) => hidden.id === post.id))
    .filter((post) => !post.isHidden)
    .filter((post, index, self) =>
      index === self.findIndex((p) => p.id === post.id)
    );

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
          data={latestCreatedProfiles ?? []}
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
