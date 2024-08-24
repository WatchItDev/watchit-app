// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// MOCK IMPORTS
import { _mock } from 'src/_mock';

// COMPONENTS IMPORTS
import CarouselMain from 'src/components/carousel/variants/carousel-main';
import CarouselMixed from 'src/components/carousel/variants/carousel-mixed';
import CarouselPoster from 'src/components/carousel/variants/carousel-poster';
import { CarouselSection } from '../../components/carousel/carousel-section';

// ----------------------------------------------------------------------

const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));

// ----------------------------------------------------------------------

export default function ExploreView() {
  return (
    <Container sx={{ p: '0 !important', maxWidth: '2000px !important' }}>
      <Stack spacing={3} sx={{ pb: 6 }}>
        <CarouselMain data={_carouselsExample.slice(12, 16)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={_carouselsExample.slice(8, 16)} />
        </CarouselSection>

        <CarouselMixed data={_carouselsExample.slice(0, 8)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={_carouselsExample.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={_carouselsExample.slice(8, 16)} />
        </CarouselSection>
      </Stack>
    </Container>
  );
}
