// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// MOCK IMPORTS
import { moviesMock } from '@src/_mock';

// COMPONENTS IMPORTS
import CarouselMain from '@src/components/carousel/variants/carousel-main';
import CarouselMixed from '@src/components/carousel/variants/carousel-mixed';
import CarouselPoster from '@src/components/carousel/variants/carousel-poster';
import CarouselPosterMini from '@src/components/carousel/variants/carousel-poster-mini';
import CarouselPosterHorizontal from '@src/components/carousel/variants/carousel-poster-horizontal';
import {
  usePublications,
  PublicationType,
  appId,
} from '@lens-protocol/react-web';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { type Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import { CarouselSection } from '../../components/carousel/carousel-section';
import { LoadingScreen } from '../../components/loading-screen';
import { getAccessiblePublications } from '../../utils/publication';

// ----------------------------------------------------------------------

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

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3} sx={{ pb: 6 }}>
         <CarouselMain data={movieArr} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={movieArr} />
        </CarouselSection>

         <CarouselMixed data={movieArr} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPosterMini data={movieArr} />
        </CarouselSection>

        <Stack spacing={1}>
          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={movieArr} />
          </CarouselSection>

          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={movieArr} />
          </CarouselSection>

          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={movieArr} />
          </CarouselSection>
        </Stack>

        {/* <CarouselSection> */}
        {/*  <Box sx={{width:"100%",display:'flex'}}> */}
        {/*    <Box sx={{width:"50%"}}> */}
        {/*      <CarouselSlider title='Movies on awards' data={moviesMock.slice(8, 16)} /> */}
        {/*    </Box> */}
        {/*    <Box sx={{width:"25%",padding:'0px 10px',height:'100%'}}> */}
        {/*      <CarouselSliderMini title='Fast' data={moviesMock.slice(0, 16)} /> */}
        {/*    </Box> */}
        {/*    <Box sx={{width:"25%",padding:'0px 10px',height:'100%'}}> */}
        {/*      <CarouselSliderMini title='On Parties' data={moviesMock.slice(0, 16)} /> */}
        {/*    </Box> */}
        {/*  </Box> */}
        {/* </CarouselSection> */}
      </Stack>
    </Container>
  );
}
