// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// MOCK IMPORTS
import { moviesMock } from 'src/_mock';

// COMPONENTS IMPORTS
import CarouselMain from 'src/components/carousel/variants/carousel-main';
import CarouselMixed from 'src/components/carousel/variants/carousel-mixed';
import CarouselPoster from 'src/components/carousel/variants/carousel-poster';
import CarouselPosterMini from 'src/components/carousel/variants/carousel-poster-mini';
import CarouselPosterHorizontal from 'src/components/carousel/variants/carousel-poster-horizontal';
import { usePublications, PublicationType, profileId, appId } from '@lens-protocol/react-web';
import { CarouselSection } from '../../components/carousel/carousel-section';
import { useAuth } from '../../hooks/use-auth';

// ----------------------------------------------------------------------

export default function ExploreView() {
  const { selectedProfile } = useAuth();
  // const { data, loading, error } = usePublications({
  //   where: {
  //     publicationTypes: [PublicationType.Post]
  //   },
  // });

  console.log('selected')
  console.log(selectedProfile)
  console.log(selectedProfile?.id)
  console.log(typeof selectedProfile?.id)

  const profile = profileId(selectedProfile?.handle?.ownedBy as string)

  console.log('profileId')
  console.log(profile)

  const { data, loading, error } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        publishedOn: [appId('watchit')],
      }
    }
  });

  console.log('posts')
  console.log(data)
  console.log(data?.map((item: any) => item?.metadata?.appId))
  console.log(loading)
  console.log(error)

  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3} sx={{ pb: 6 }}>
         <CarouselMain data={moviesMock.slice(12, 16)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>

         <CarouselMixed data={moviesMock.slice(11, 15)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPosterMini data={moviesMock.slice(0, 8)} />
        </CarouselSection>

        <Stack spacing={1}>
          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
          </CarouselSection>

          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
          </CarouselSection>

          <CarouselSection title="Carousel Center Mode">
            <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
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
