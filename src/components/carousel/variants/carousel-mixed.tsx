import { useEffect } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// theme
import { bgGradient } from '@src/theme/css';
// components
import Image from '@src/components/image';
import Carousel, { CarouselDots, useCarousel } from '@src/components/carousel/index';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import { m } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconFlagFilled, IconStarFilled, IconPlayerPlay } from '@tabler/icons-react';
import Stack from '@mui/material/Stack';

// @ts-ignore
import { type Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import moment from 'moment';
import { varFade } from '../../animate';
import { Poster } from '../../poster/types';
import { PosterVertical } from '../../poster';
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';

// ----------------------------------------------------------------------

const StyledThumbnailsContainer = styled('div')<{ length: number }>(() => ({
  position: 'absolute',
  bottom: 50,
  right: '50px',
  zIndex: 1,
  maxWidth: '45%',
  borderRadius: 2,
  '& .slick-slide': {
    lineHeight: 0,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  data: Post[]
};

export default function CarouselMixed({ data }: Props) {
  const carouselLarge = useCarousel({
    draggable: true,
    swipeToSlide: true,
    adaptiveHeight: true,
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', top: 50, right: '50px', color: '#fff' },
    }),
  });

  const carouselThumb = useCarousel({
    swipeToSlide: true,
    focusOnSelect: true,
    slidesToShow: 3
  });

  useEffect(() => {
    carouselLarge.onSetNav();
    carouselThumb.onSetNav();
  }, [carouselLarge, carouselThumb]);

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`

  const getWallpaperCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw?.uri
  const getPosterCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Vertical Poster')?.image?.raw?.uri
  const getPosterHorizontalCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Horizontal Poster')?.image?.raw?.uri

  const getMovieYear = (post: any): number => {
    const releaseDate = post?.metadata?.attributes?.find((el: any) => el.key === 'Release Date')?.value;
    return releaseDate ? +moment(releaseDate).format('YYYY') : 0
  }

  const getMovieGenres = (post: any): string => post?.metadata?.attributes?.find((el: any) => el.key === 'Genres')?.value

  const renderLargeImg = (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
      >
        {data.map((post: any, index: number) => (
          <Box key={post.id}>
            <CarouselLargeItem
              poster={{
                id: post?.id,
                title: post?.metadata?.title,
                genre: getMovieGenres(post).split(', '),
                images: {
                  vertical: getMediaUri(getPosterCid(post)),
                  horizontal: getMediaUri(getPosterHorizontalCid(post)),
                  wallpaper: getMediaUri(getWallpaperCid(post))
                },
                likes: post?.stats?.upvotes ?? 0,
                synopsis: post?.metadata?.content ?? '',
                year: getMovieYear(post)
              }}
              active={carouselLarge.currentIndex === index}
            />
          </Box>
        ))}
      </Carousel>
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={data.length}>
      <Carousel
        {...carouselThumb.carouselSettings}
        asNavFor={carouselLarge.nav}
        ref={carouselThumb.carouselRef}
      >
         {data.map((post:any, index: number) => (
          <Box key={post.id} sx={{ px: 0.75, cursor: 'pointer' }}>
            <CarouselThumbItem
              poster={{
                id: post?.id,
                title: post?.metadata?.title,
                genre: getMovieGenres(post).split(', '),
                images: {
                  vertical: getMediaUri(getPosterCid(post)),
                  horizontal: getMediaUri(getPosterHorizontalCid(post)),
                  wallpaper: getMediaUri(getWallpaperCid(post))
                },
                likes: post?.stats?.upvotes ?? 0,
                synopsis: post?.metadata?.content ?? '',
                year: getMovieYear(post)
              }}
              active={carouselLarge.currentIndex === index}
            />
          </Box>
         ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {renderLargeImg}

      {renderThumbnails}
    </Box>
  );
}


type CarouselThumbItemProps = {
  active: boolean;
  poster: Poster
};

function CarouselThumbItem({ poster, active }: CarouselThumbItemProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        opacity: 0.48,
        cursor: 'pointer',
        pointerEvents: 'none',
        ...( active && {
          opacity: 1,
          border: `solid 4px ${theme.palette.primary.main}`,
        }),
      }}
    >
      <PosterVertical {...poster} />
    </Paper>
  );
}


type CarouselLargeItemProps = {
  poster: Poster
  active: boolean
};

function CarouselLargeItem({ poster}:  Readonly<CarouselLargeItemProps>) {
  const theme = useTheme();
  const router = useRouter();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const handlePlay = () => {
    router.push(paths.dashboard.publication.details(poster.id));
  }

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none' }}>

      <Image dir="ltr" alt={poster.title} src={poster.images.wallpaper} ratio="21/9" />

      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          position: 'absolute',
          zIndex: 0,
          ...bgGradient({
            direction: 'to top',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0)} 100%`,
          }),
        }}
      />

      <Box
        sx={{
          top: 0,
          width: 1,
          height: 1,
          zIndex: 0,
          position: 'absolute',
          ...bgGradient({
            direction: 'to bottom',
            startColor: `#1E1F22 0%`,
            endColor: `${alpha('#1E1F22', 0)} 100%`,
          }),
        }}
      />

      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          width: '50%',
          height: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '50px !important'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <m.div variants={variants}>
            <Typography lineHeight={1} sx={{ fontSize: 'clamp(1.7rem, 1vw, 2.5rem)',fontWeight: 'bold' }} noWrap gutterBottom>
              Featured in watchit
            </Typography>
            <Typography color="textSecondary" lineHeight={1} sx={{ fontSize: 'clamp(0.8rem, 1vw, 2rem)' }} noWrap gutterBottom>
              Best featured for you today
            </Typography>
          </m.div>
        </Box>

        {/* Title */}
        <Box sx={{width: '100%'}}>
          {/* Title */}
          <m.div variants={variants}>
            <Typography sx={{ fontSize: 'clamp(1.7rem, 1vw, 2.5rem)', fontWeight: 'bold', lineHeight: 1.1, mb: 0.5 }} gutterBottom>
              {poster.title}
            </Typography>
          </m.div>
          {/* Details: Rating, Year, Genre */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconStarFilled size={14} color="#FFCD19"/>
              <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }} variant="body2">{poster.rating}</Typography>
            </Stack>
            <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
            <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2">{poster.year}</Typography>
            <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
            <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
              { poster.genre.join('  -  ') }
            </Typography>
          </Stack>
          <Box>
            <m.div  variants={variants}>
              <Typography sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '5',
                WebkitBoxOrient: 'vertical',
                fontWeight: '700'
              }}
                          variant="body2" >
                {poster.synopsis}
              </Typography>
            </m.div>
          </Box>
          <m.div className='flex space-x-6' variants={variants}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant='contained'
                sx={{
                  mt: 3 ,
                  color:'#FFFFFF',
                  background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
                  height: '40px'
                }}
                onClick={handlePlay}
              >
                <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                Play now
              </Button>
              <Button
                variant="outlined"
                sx={{
                  mt: 3,
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  height: '40px'
                }}
              >
                <IconFlagFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                Add watchlist
              </Button>
            </Stack>
          </m.div>
        </Box>
      </CardContent>
    </Paper>
  );
}
