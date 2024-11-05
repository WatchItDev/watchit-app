// @mui
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Carousel, { CarouselArrows, useCarousel } from '@src/components/carousel/index';
import PosterMini from '@src/components/poster/variants/poster-mini';
// @ts-ignore
import { type Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import moment from 'moment/moment';

// ----------------------------------------------------------------------

type Props = {
  data: Post[]
};

export default function CarouselPosterMini({ data }: Props) {
  const carousel = useCarousel({
    slidesToShow: 4,
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

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`

  const getWallpaperCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw?.uri
  const getPosterCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Vertical Poster')?.image?.raw?.uri
  const getPosterHorizontalCid = (post: any): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Horizontal Poster')?.image?.raw?.uri

  const getMovieYear = (post: any): number => {
    const releaseDate = post?.metadata?.attributes?.find((el: any) => el.key === 'Release Date')?.value;
    return releaseDate ? +moment(releaseDate).format('YYYY') : 0
  }

  const getMovieGenres = (post: any): string => post?.metadata?.attributes?.find((el: any) => el.key === 'Genres')?.value

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '.slick-track': {
          height: '100%'
        },
        '.slick-slide': {
          height: '100%',
          minHeight: '100%',
          maxHeight: '100%'
        },
        '.slick-slide > div': {
          height: '100%',
          minHeight: '100%',
          maxHeight: '100%'
        }
      }}
    >
      <CarouselArrows
        filled
        shape="rounded"
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data.map((post: any, index: number) => (
            <Box key={post.id} sx={{ px: 0.75, display:'flex !important', height: '100%' }}>
              <Box sx={{display:'flex',alignItems:'center'}}>
                <Typography fontWeight="fontWeightBold" sx={{ fontSize: 'clamp(2rem, 0.8vw, 2rem)', whiteSpace: 'nowrap', marginRight:'10px' }} variant='body2'>{index + 1}</Typography>
              </Box>
              <PosterMini
                id={post?.id}
                title={post?.metadata?.title}
                genre={getMovieGenres(post).split(', ')}
                images={{
                  vertical: getMediaUri(getPosterCid(post)),
                  horizontal: getMediaUri(getPosterHorizontalCid(post)),
                  wallpaper: getMediaUri(getWallpaperCid(post))
                }}
                likes={post?.stats?.upvotes ?? 0}
                synopsis={post?.metadata?.content ?? ''}
                year={getMovieYear(post)}
              />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
