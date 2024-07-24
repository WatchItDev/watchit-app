// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// components
import Image from 'src/components/image';
import Carousel, { CarouselArrowIndex, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
};

export default function CarouselBasic2({ data }: Props) {
  const carousel = useCarousel({
    fade: true,
    autoplay: true,
    initialSlide: 2,
  });

  return (
    <Card>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data.map((item) => (
          <Stack key={item.id}>
            <Image alt={item.title} src={item.coverUrl} ratio="4/3" />

            <CardContent sx={{ textAlign: 'left' }}>
              <Typography variant="h6" noWrap gutterBottom>
                {item.title}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {item.description}
              </Typography>
            </CardContent>
          </Stack>
        ))}
      </Carousel>

      <CarouselArrowIndex
        index={carousel.currentIndex}
        total={data.length}
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        sx={{ bottom: 120 }}
      />
    </Card>
  );
}
