// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// COMPONENTS IMPORTS
import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini';

import {
  usePublications,
  PublicationType,
  appId,
  // ProfileSession, useSession,
  // useRecommendedProfiles,
  // profileId,
  // useBookmarks,
  // useExploreProfiles,
  // ExploreProfilesOrderByType,
  // useExplorePublications, ExplorePublicationsOrderByType, ExplorePublicationType,
} from '@lens-protocol/react-web';

import { LoadingScreen } from '../../components/loading-screen';
import { getAccessiblePublications } from '../../utils/publication';
import {CarouselSection} from "@src/components/poster/carousel-section.tsx";
import Box from "@mui/material/Box";
import CarouselTopTitles from "@src/components/carousel/variants/carousel-top-titles.tsx";
import CarouselCreators from "@src/components/carousel/variants/carousel-creators.tsx";

// import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// ----------------------------------------------------------------------
export type TrendingTopicsType = {
  id: number,
  image: string,
  title: string,
  desc: string
}

export default function ExploreView() {
  // const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { data, loading }: any = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        // mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: [appId('watchit')],
      }
    }
  });
  // const { data: recommendedProfiles, loading: recommendedProfilesLoading, error: recommendedProfilesError } = useRecommendedProfiles({
  //   for: sessionData?.profile?.id ?? profileId('0x043b')
  // });
  // const { data: bookmark, loading: bookmarkLoading, error: bookmarkError } = useBookmarks();
  // const { data: exploreProfiles, error: exploreProfilesError, loading: exploreProfilesLoading } = useExploreProfiles({
  //   orderBy: ExploreProfilesOrderByType.MostPublication
  // });
  //
  // const { data: explorePublications, error: explorePublicationsError, loading: explorePublicationsLoading } = useExplorePublications({
  //   where: {
  //     publicationTypes: [ExplorePublicationType.Post],
  //   },
  //   orderBy: ExplorePublicationsOrderByType.TopCommented,
  // });

  // console.log('hello recommended profiles')
  // console.log(sessionData?.profile?.id ?? profileId('0x043b'))
  // console.log(recommendedProfiles)
  // console.log(recommendedProfilesLoading)
  // console.log(recommendedProfilesError)
  //
  // console.log('hello bookmark')
  // console.log(bookmark)
  // console.log(bookmarkLoading)
  // console.log(bookmarkError)
  //
  // console.log('hello explore profiles')
  // console.log(exploreProfiles)
  // console.log(exploreProfilesLoading)
  // console.log(exploreProfilesError)
  //
  // console.log('hello explore publications')
  // console.log(explorePublications)
  // console.log(explorePublicationsLoading)
  // console.log(explorePublicationsError)



  if (loading) return <LoadingScreen />

  const movieArr: any = getAccessiblePublications([...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data])

  const topic = [
    {
      id: 1,
      desc: 'Description for the content trending during the week ',
      title: 'Jhon Doe',
      image: 'https://static0.srcdn.com/wordpress/wp-content/uploads/2023/09/lord-of-the-rings-movies-in-order.jpg'
    },
    {
      id: 2,
      desc: 'Description for the content trending during the week ',
      title: 'Dina Doe',
      image: 'https://i.blogs.es/6ff623/resident-evil-milla-jovovich/1366_2000.jpeg'
    },
    {
      id: 3,
      desc: 'Description for the content trending during the week ',
      title: 'Lina Doe',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSpAo-w7KfZSCvVq81iaatdILc-VWTw-2TkQ&s'
    },
    {
      id: 4,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 5,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 6,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 7,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 8,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 9,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 10,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 11,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 12,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 13,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 14,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 15,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 16,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 17,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 18,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 19,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 20,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 21,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 22,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 23,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 24,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 25,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 26,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 27,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 28,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 29,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
    {
      id: 30,
      desc: 'Description for the content trending during the week ',
      title: 'Jane Doe',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    },
  ];

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3}>
        <CarouselTopTitles data={movieArr} />
        <CarouselSection title="Recent publications">
          <CarouselPosterMini data={movieArr} />
        </CarouselSection>

        <Box sx={{ mt: 3, maxWidth: '100vw !important' }}>
          <CarouselSection title="Latest creators">
            <CarouselCreators
              data={topic}
              category="latest"
              minItemWidth={250}
              maxItemWidth={400}
            />
          </CarouselSection>
        </Box>
      </Stack>
    </Container>
  );
}
