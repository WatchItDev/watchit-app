// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// theme
import { bgBlur } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const StyledContentItem = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.grey[900] }),
  bottom: 0,
  zIndex: 9,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  justifyContent: 'space-between',
  flexDirection: theme.direction === 'rtl' ? 'row-reverse' : 'row',
}));

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
};

export default function CarouselBasic4({ data }: Props) {
  const carousel = useCarousel({
    autoplay: true,
    fade: true,
  });

  return (
    <Card>
      <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((item) => (
            <CarouselItem key={item.id} item={item} />
          ))}
        </Carousel>
      </CarouselArrows>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  title: string;
  description: string;
  coverUrl: string;
};

function CarouselItem({ item }: { item: CarouselItemProps }) {
  const { coverUrl, title } = item;

  return (
    <Box sx={{ position: 'relative', zIndex: 0 }}>
      <Image alt={title} src={coverUrl} ratio="1/1" />

      <StyledContentItem>
        <Typography variant="h6" sx={{ color: 'common.white' }}>
          {item.title}
        </Typography>
        <IconButton
          onClick={() => {}}
          sx={{
            color: 'common.white',
            '&:hover': {
              bgcolor: (theme) =>
                alpha(theme.palette.common.white, theme.palette.action.hoverOpacity),
            },
          }}
        >
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>
      </StyledContentItem>
    </Box>
  );
}
