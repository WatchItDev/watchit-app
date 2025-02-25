// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// components
import Image from '@src/components/image';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from '@src/components/carousel';

// ----------------------------------------------------------------------

interface Props {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
}

export default function CarouselBasic3({ data }: Props) {
  const theme = useTheme();

  const carousel = useCarousel({
    autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', top: 0, right: 0, color: '#fff' },
    }),
  });

  return (
    <Box
      sx={{
        position: 'relative',
        '& .slick-list': {
          borderRadius: 2,
          boxShadow: theme.customShadows.z16,
        },
      }}
    >
      <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((item) => (
            <CarouselItem key={item.id} item={item} />
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface CarouselItemProps {
  title: string;
  description: string;
  coverUrl: string;
}

function CarouselItem({ item }: { item: CarouselItemProps }) {
  const { coverUrl, title } = item;

  return <Image alt={title} src={coverUrl} ratio="1/1" />;
}
