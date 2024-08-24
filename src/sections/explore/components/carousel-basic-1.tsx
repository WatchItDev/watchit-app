// @mui
import Card from '@mui/material/Card';
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

export default function CarouselBasic1({ data }: Props) {
  const carousel = useCarousel({
    autoplay: true,
  });

  return (
    <Card>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data.map((item) => (
          <Image key={item.id} alt={item.title} src={item.coverUrl} ratio="1/1" />
        ))}
      </Carousel>

      <CarouselArrowIndex
        index={carousel.currentIndex}
        total={data.length}
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
      />
    </Card>
  );
}
