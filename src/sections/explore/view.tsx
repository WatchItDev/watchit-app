// MUI IMPORTS
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// MOCK IMPORTS
import { _mock, moviesMock } from 'src/_mock';

// COMPONENTS IMPORTS
import CarouselMain from 'src/components/carousel/variants/carousel-main';
import CarouselMixed from 'src/components/carousel/variants/carousel-mixed';
import CarouselPoster from 'src/components/carousel/variants/carousel-poster';
import CarouselSlider from 'src/components/carousel/variants/carousel-slider';
import MovieDetailMain from 'src/components/carousel/variants/movie-detail-main';
import PosterHorizontal from 'src/components/poster/variants/poster-horizontal';
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
         <CarouselMain data={moviesMock.slice(12, 16)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>

         <CarouselMixed data={moviesMock.slice(0, 8)} />

        <CarouselSection title="Carousel Center Mode">
          <CarouselPoster data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection>
          <Box sx={{width:"40%"}}>
            <CarouselSlider title='Movies on awards' data={moviesMock.slice(8, 16)} />
          </Box>
        </CarouselSection>

        <CarouselSection>
          <Box sx={{width:"40%"}}>
            <PosterHorizontal {...moviesMock.slice(8, 16)[0]} />
          </Box>
        </CarouselSection>

        <CarouselSection>
          <Box sx={{width:"100%",height:'800px'}}>
            <MovieDetailMain data={moviesMock.slice(8, 16)}/>
          </Box>
        </CarouselSection>
      </Stack>
    </Container>
  );
}
