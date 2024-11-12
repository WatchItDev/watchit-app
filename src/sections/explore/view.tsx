// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// COMPONENTS IMPORTS
import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini';

import {
  usePublications,
  PublicationType,
  appId,
} from '@lens-protocol/react-web';

import { LoadingScreen } from '../../components/loading-screen';
import { getAccessiblePublications } from '../../utils/publication';
import {CarouselSection} from "@src/components/poster/carousel-section.tsx";
import Box from "@mui/material/Box";
import CarouselTopicsTrending from "@src/components/carousel/variants/carousel-topics-trending.tsx";
import CarouselTopTitles from "@src/components/carousel/variants/carousel-top-titles.tsx";

// ----------------------------------------------------------------------
export type TrendingTopicsType = {
  id: number,
  image: string,
  title: string,
  desc: string
}

export default function ExploreView() {
  const { data, loading, error }: any = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        // mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: [appId('watchit')],
      }
    }
  });

  console.log('posts')
  console.log(loading)
  console.log(data)
  console.log(data?.map((item: any) => item?.metadata?.appId))
  console.log(error)

  if (loading) return <LoadingScreen />

  const movieArr: any = getAccessiblePublications([...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data])

  const topic = [
    {
      id: 1,
      desc: 'Description for the content trending during the week ',
      title: 'The Lord of the Rings',
      image: 'https://static0.srcdn.com/wordpress/wp-content/uploads/2023/09/lord-of-the-rings-movies-in-order.jpg'
    },
    {
      id: 2,
      desc: 'Description for the content trending during the week ',
      title: 'Resident Evil',
      image: 'https://i.blogs.es/6ff623/resident-evil-milla-jovovich/1366_2000.jpeg'
    },
    {
      id: 3,
      desc: 'Description for the content trending during the week ',
      title: 'Gladiator',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSpAo-w7KfZSCvVq81iaatdILc-VWTw-2TkQ&s'
    },
    {
      id: 4,
      desc: 'Description for the content trending during the week ',
      title: 'Matrix',
      image: 'https://static.euronews.com/articles/stories/08/35/93/32/1440x810_cmsv2_c7416dac-8a99-57b8-b728-b28d69040539-8359332.jpg'
    }
  ];

  const trendingTopics = [
    ...topic,
    ...topic
  ];

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3}>
        <CarouselTopTitles data={movieArr} />
        <CarouselSection title="Recent publications">
          <CarouselPosterMini data={movieArr} />
        </CarouselSection>

        <Box sx={{ mt: 3 }}>
          <CarouselSection title="Find by creators">
            <CarouselTopicsTrending data={trendingTopics} />
          </CarouselSection>
        </Box>
      </Stack>
    </Container>
  );
}
