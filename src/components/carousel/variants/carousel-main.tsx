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
import { bgGradient } from '@src/theme/css';
// components
import Image from '@src/components/image';
import { varFade } from '@src/components/animate';
import Carousel, { CarouselDots, useCarousel } from '@src/components/carousel/index';
import { IconFlagFilled, IconPlayerPlay } from '@tabler/icons-react';
import Stack from '@mui/material/Stack';

// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { type Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';

// ----------------------------------------------------------------------

type Props = {
  data: Post[];
};

export default function CarouselMain({ data }: Props) {
  const carousel = useCarousel({
    speed: 800,
    // autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', bottom: 20, right: '50px', color: '#fff' },
    }),
  });

  return (
    <Card sx={{ borderRadius: 0, boxShadow: 'none' }}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {data.map((post, index) => (
          <CarouselItem key={post.id} post={post} active={index === carousel.currentIndex} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  post: any;
  active: boolean;
};

function CarouselItem({ post }: Readonly<CarouselItemProps>) {
  const theme = useTheme();
  const router = useRouter();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const handlePlay = () => {
    router.push(paths.dashboard.publication.details(`${post.id}`));
  };

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;

  const getWallpaperCid = (): string =>
    post?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw?.uri;

  const getMovieYear = (): string =>
    post?.metadata?.attributes?.find((el: any) => el.key === 'Release Date')?.value;

  const getMovieGenres = (): string =>
    post?.metadata?.attributes?.find((el: any) => el.key === 'Genres')?.value;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>
      <Image
        dir="ltr"
        alt={post.metadata?.title}
        src={getMediaUri(getWallpaperCid())}
        ratio="21/9"
      />

      <Box
        sx={{
          bottom: 0,
          zIndex: 8,
          width: '100%',
          height: '100%',
          textAlign: 'left',
          position: 'absolute',
          ...bgGradient({
            direction: 'to top',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0.2)} 100%`,
          }),
        }}
      />
      <Box
        sx={{
          bottom: 0,
          zIndex: 7,
          width: '100%',
          height: '100%',
          textAlign: 'left',
          position: 'absolute',
          ...bgGradient({
            direction: 'to top',
            startColor: `${alpha('#1E1F22', 0.7)} 30%`,
            endColor: `${alpha('#1E1F22', 0.2)} 100%`,
          }),
        }}
      />

      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          // width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          padding: '50px 50px 20px !important',
          width: '50%',
          '@media (max-width: 500px)': {
            width: '100%',
          },
        }}
      >
        {/* Title */}
        <m.div variants={variants}>
          <Typography
            sx={{
              fontSize: 'clamp(2rem, 1vw, 3rem)',
              fontWeight: 'bold',
              lineHeight: 1.1,
              mb: 0.5,
            }}
            gutterBottom
          >
            {post?.metadata?.title}
          </Typography>
        </m.div>
        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          {/* <Stack direction="row" spacing={0.5} alignItems="center"> */}
          {/*  <IconStarFilled size={14} color="#FFCD19"/> */}
          {/*  <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }} variant="body2">{poster.rating}</Typography> */}
          {/* </Stack> */}
          {/* <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography> */}
          <Typography
            sx={{ fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }}
            variant="body2"
          >
            {getMovieYear()}
          </Typography>
          <Typography
            sx={{ fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)' }}
            variant="body2"
            color="textSecondary"
          >
            |
          </Typography>
          <Typography
            sx={{ fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }}
            variant="body2"
            color="textSecondary"
          >
            {getMovieGenres().split(', ').join('  -  ')}
          </Typography>
        </Stack>
        <Box>
          <m.div variants={variants}>
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '5',
                WebkitBoxOrient: 'vertical',
                fontWeight: '700',
              }}
              variant="body2"
            >
              {post?.metadata?.content ?? ''}
            </Typography>
          </m.div>
        </Box>
        <m.div className="flex space-x-6" variants={variants}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              sx={{
                mt: 3,
                color: '#FFFFFF',
                background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
                height: '40px',
              }}
              onClick={handlePlay}
            >
              <IconPlayerPlay style={{ marginRight: '4px' }} size={22} color="#FFFFFF" />
              Play now
            </Button>
            <Button
              variant="outlined"
              sx={{
                mt: 3,
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                height: '40px',
              }}
            >
              <IconFlagFilled style={{ marginRight: '4px' }} size={22} color="#FFFFFF" />
              Add watchlist
            </Button>
          </Stack>
        </m.div>
      </CardContent>
    </Paper>
  );
}
