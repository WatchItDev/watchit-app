// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import  Tabs  from '@mui/base/Tabs';
import TabsList from '@mui/base/TabsList';
import TabPanel from '@mui/base/TabPanel';
import  Tab, { tabClasses} from '@mui/base/Tab';
import { styled } from '@mui/system';

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

  const arrayTabs = [
    'All','Pop culture','Comedy','Drama','Action','Adventure','Fantasy','Horror','Mystery','Romance','Sci-fi','Thriller'
  ];

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3} sx={{ p: 6 }}>
        <Tabs defaultValue={0}>
          <TabsListStyled>
            {arrayTabs.map((item, index) => (
              <TabStyled key={`tab-${item}-${index}`} value={index}>
                {item}
              </TabStyled>
            ))}
          </TabsListStyled>
          {arrayTabs.map((_item, index) => (
            <TabPanelStyled key={`tabContent-${_item}-${index}`} value={index}>
              <CarouselSection title="Top success creators">
                <CarouselPosterMini data={movieArr} />
              </CarouselSection>

              <Box sx={{ mt: 3 }}>
                <CarouselSection title="Popular this week">
                  <CarouselTopicsTrending data={trendingTopics} />
                </CarouselSection>
              </Box>

              <Box sx={{ mt: 3 }}>
                <CarouselSection title="Newest on Watchit">
                  <CarouselPosterMini data={movieArr} />
                </CarouselSection>
              </Box>
            </TabPanelStyled>
          ))}
        </Tabs>
      </Stack>
    </Container>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
  'bg': '#2B2D31',
};

const TabStyled = styled(Tab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: ${grey[500]};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${grey['bg']};
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${grey[900]};
  }

  &:focus {
    color: #fff;
  }

  &.${tabClasses.selected} {
    background-color: ${grey[900]};
    color: ${grey[50]};
  }
`;

const TabPanelStyled = styled(TabPanel)(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  padding: 20px 12px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border-radius: 12px;
  opacity: 0.6;
  `,
);

const TabsListStyled = styled(TabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: transparent;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);
