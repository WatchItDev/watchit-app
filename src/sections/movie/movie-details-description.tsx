import Stack from '@mui/material/Stack';

// components
import { CarouselSection } from '../../components/carousel/carousel-section';
import CarouselPoster from '../../components/carousel/variants/carousel-poster';
import { moviesMock } from '../../_mock';

// ----------------------------------------------------------------------

type Props = {
  description: string;
};

export default function MovieDetailsDescription({ description }: Props) {
  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      <CarouselSection title="Similar movies for you">
        <CarouselPoster data={moviesMock.slice(8, 16)} />
      </CarouselSection>

      <CarouselSection title="Your friends also watched">
        <CarouselPoster data={moviesMock.slice(8, 16)} />
      </CarouselSection>
    </Stack>
  );
}
