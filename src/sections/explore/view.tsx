// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// MOCK IMPORTS
import { _mock, moviesMock } from 'src/_mock';

// COMPONENTS IMPORTS
import CarouselMain from 'src/components/carousel/variants/carousel-main';
import CarouselMixed from 'src/components/carousel/variants/carousel-mixed';
import CarouselPoster from 'src/components/carousel/variants/carousel-poster';
import { CarouselSection } from '../../components/carousel/carousel-section';

// ----------------------------------------------------------------------

export default function ExploreView() {
  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3} sx={{ pb: 6 }}>
         <CarouselMain data={moviesMock.slice(12, 16)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>

         <CarouselMixed data={moviesMock.slice(0, 8)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>
      </Stack>
    </Container>
  );
}
