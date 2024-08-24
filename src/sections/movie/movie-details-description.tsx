import Stack from '@mui/material/Stack';

// components
import { CarouselSection } from '../../components/carousel/carousel-section';
import CarouselPoster from '../../components/carousel/variants/carousel-poster';
import { _mock } from '../../_mock';

const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));

// ----------------------------------------------------------------------

type Props = {
  description: string;
};

export default function MovieDetailsDescription({ description }: Props) {
  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      <CarouselSection title="Similar movies for you">
        <CarouselPoster data={_carouselsExample.slice(8, 16)} />
      </CarouselSection>

      <CarouselSection title="Your friends also watched">
        <CarouselPoster data={_carouselsExample.slice(8, 16)} />
      </CarouselSection>
    </Stack>
  );
}
