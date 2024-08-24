import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel/index';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
};

export default function CarouselMain({ data }: Props) {
  const carousel = useCarousel({
    speed: 800,
    // autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', bottom: 50, right: '50px', color: '#fff' },
    }),
  });

  return (
    <Card sx={{ borderRadius: 0, boxShadow: 'none' }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data.map((item, index) => (
          <CarouselItem key={item.id} item={item} active={index === carousel.currentIndex} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  item: {
    title: string;
    description: string;
    coverUrl: string;
  };
  active: boolean;
};

function CarouselItem({ item, active }: CarouselItemProps) {
  const theme = useTheme();

  const { coverUrl, title } = item;

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
      <Image dir="ltr" alt={title} src={coverUrl} ratio="21/9" />

      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          position: 'absolute',
          ...bgGradient({
            direction: 'to top',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0)} 100%`,
          }),
        }}
      />
      <Container>
        <CardContent
          component={MotionContainer}
          animate={active}
          action
          sx={{
            left: '50px',
            bottom: 50,
            maxWidth: '50%',
            p: '0 !important',
            textAlign: 'left',
            position: 'absolute',
            color: 'common.white',
          }}
        >
          <m.div variants={variants}>
            <Typography variant="h3" gutterBottom>
              {item.title}
            </Typography>
          </m.div>

          <m.div variants={variants}>
            <Typography variant="body2" noWrap gutterBottom>
              {item.description}
            </Typography>
          </m.div>

          <m.div variants={variants}>
            <Button variant="contained" sx={{ mt: 3 }}>
              View More
            </Button>
          </m.div>
        </CardContent>
      </Container>
    </Paper>
  );
}
