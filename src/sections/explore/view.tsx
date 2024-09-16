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
import CarouselPosterMini from 'src/components/carousel/variants/carousel-poster-mini';
import CarouselPosterHorizontal from 'src/components/carousel/variants/carousel-poster-horizontal';
import MovieDetailMain from 'src/components/carousel/variants/movie-detail-main';
import PosterHorizontal from 'src/components/poster/variants/poster-horizontal';
import PosterMini from 'src/components/poster/variants/poster-mini';
import CarouselSliderMini from 'src/components/carousel/variants/carousel-slider-mini';
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
          <CarouselPosterMini data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection title="Carousel Center Mode">
          <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection title="Carousel Center Mode">
          <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection title="Carousel Center Mode">
          <CarouselPosterHorizontal data={moviesMock.slice(8, 16)} />
        </CarouselSection>

        <CarouselSection>
          <Box sx={{width:"100%",display:'flex'}}>
            <Box sx={{width:"50%"}}>
              <CarouselSlider title='Movies on awards' data={moviesMock.slice(8, 16)} />
            </Box>
            <Box sx={{width:"25%",padding:'0px 10px',height:'100%'}}>
              <CarouselSliderMini title='Fast' data={moviesMock.slice(0, 16)} />
            </Box>
            <Box sx={{width:"25%",padding:'0px 10px',height:'100%'}}>
              <CarouselSliderMini title='On Parties' data={moviesMock.slice(0, 16)} />
            </Box>
          </Box>
        </CarouselSection>
      </Stack>
    </Container>
  );
}
