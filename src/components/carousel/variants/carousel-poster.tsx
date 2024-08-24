// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel/index';

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
};

export default function CarouselPoster({ data }: Props) {
  const carousel = useCarousel({
    slidesToShow: 5,
    adaptiveHeight: true,
    focusOnSelect: true,
    swipeToSlide: true,
    lazyLoad: 'progressive',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CarouselArrows
        filled
        shape="rounded"
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((item) => (
            <Box key={item.id} sx={{ px: 0.75 }}>
              <CarouselItem item={item} />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: {
    title: string;
    description: string;
    coverUrl: string;
  };
};

function CarouselItem({ item }: CarouselItemProps) {
  const theme = useTheme();

  const { coverUrl, title } = item;

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Image alt={title} src={coverUrl} ratio="4/6" />

      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          ...bgGradient({
            direction: 'to top',
            startColor: `#000 25%`,
            endColor: `${alpha('#000', 0)} 100%`,
          }),
        }}
      >
        <TextMaxLine variant="h4" sx={{ mb: 2 }}>
          {title}
        </TextMaxLine>

        <Link
          color="inherit"
          variant="overline"
          sx={{
            opacity: 0.72,
            alignItems: 'center',
            display: 'inline-flex',
            transition: theme.transitions.create(['opacity']),
            '&:hover': { opacity: 1 },
          }}
        >
          learn More
          <Iconify icon="eva:arrow-forward-fill" width={16} sx={{ ml: 1 }} />
        </Link>
      </CardContent>
    </Paper>
  );
}
