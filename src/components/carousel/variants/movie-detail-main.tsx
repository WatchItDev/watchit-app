import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// theme
import { bgGradient } from '@src/theme/css';
// components
import Image from '@src/components/image';
import { varFade } from '@src/components/animate';
import { IconStarFilled, IconPlayerPlay, IconFlagFilled, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Post } from '@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated';
import { TokenAllowanceLimit, useApproveModule, PrimaryPublication, PublicationReactionType, hasReacted, useReactionToggle } from '@lens-protocol/react-web';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AnyPublication, OpenActionKind, useHidePublication, useOpenAction } from '@lens-protocol/react';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useSettingsContext } from '../../settings';
import { useRouter } from '../../../routes/hooks';
import { paths } from '../../../routes/paths';
import { PosterVertical } from '../../poster';

// ----------------------------------------------------------------------

type Props = {
  post: any
};

export default function MovieDetailMain({ post }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [hasCollected, setHasCollected] = useState(false);
  const settings = useSettingsContext();
  const price = post?.openActionModules?.[0]?.amount?.value ?? ''
  const coin = post?.openActionModules?.[0]?.amount?.asset?.symbol ?? ''
  const { execute: collect, loading, error } = useOpenAction({
    action: { kind: OpenActionKind.COLLECT }
  });
  const approve = useApproveModule({
    limit: TokenAllowanceLimit.INFINITE,
  });
  const { execute: hide, loading: loadingHide } = useHidePublication();
  const { execute: toggle, loading: loadingLike, error: errorLike } = useReactionToggle();
  const [hasLiked, setHasLiked] = useState(hasReacted({ publication: post, reaction: PublicationReactionType.Upvote }));

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const toggleReaction = async () => {
    try {
      await toggle({
        reaction: PublicationReactionType.Upvote,
        publication: post,
      });
      setHasLiked(!hasLiked); // Toggle the UI based on the reaction state
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const approveCollectModuleFor = async () => {
    const result = await approve.execute({ on: post });

    if (result.isFailure()) {
      window.alert(result.error.message);
      return;
    }

    // try again the collect operation
    await collectPublication()
  };

  const collectPublication = async (): Promise<any> => {
    const result = await collect({ publication: post });

    if (result.isFailure()) {
      switch (result?.error?.name) {
        case "InsufficientAllowanceError":
          await approveCollectModuleFor();
          break

        case 'InsufficientGasError':
          window.alert(
            `The user's wallet does not have enough MATIC to pay for the transaction`
          );
          break;

        case 'PendingSigningRequestError':
          window.alert(
            'There is a pending signing request in your wallet. ' +
            'Approve it or discard it and try again.'
          );
          break;

        case 'WalletConnectionError':
          window.alert(`There was an error connecting to your wallet: ${(result ?? {})?.error?.message}`);
          break;

        case 'UserRejectedError':
          // the user decided to not sign, usually this is silently ignored by UIs
          break;

        default:
          console.log('default');
          break;
      }

      return;
    }

    // successful collect
    setHasCollected(true);
    window.alert("You have collected this publication");
    router.push(paths.movie.play(`${post.id}`));
  };

  const handleCollect = async () => {
    if (!hasCollected) {
      try {
        await collectPublication()
      } catch (e) {
        console.error('Error during collection:', e);
        console.error(JSON.stringify(e));
        alert('Error collecting the movie.');
      }
    } else {
      router.push(paths.movie.play(`${post.id}`));
    }
  };

  const handlePlay = async () => {
    router.push(paths.movie.play(`${post.id}`));
  };

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`

  const getWallpaperCid = (): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Wallpaper')?.image?.raw?.uri

  const getPosterCid = (): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Vertical Poster')?.image?.raw?.uri

  const getPosterHorizontalCid = (): string => post?.metadata?.attachments?.find((el: any) => el.altTag === 'Horizontal Poster')?.image?.raw?.uri

  const getMovieYear = (): number => {
    const releaseDate = post?.metadata?.attributes?.find((el: any) => el.key === 'Release Date')?.value;
    return releaseDate ? +moment(releaseDate).format('YYYY') : 0
  }

  const getMovieGenres = (): string => post?.metadata?.attributes?.find((el: any) => el.key === 'Genres')?.value

  const handleHide = async () => {
    console.log('handle hide')
    await hide({ publication: post })
    console.log('publication hided')
  };

  console.log('hello price and coin')
  console.log(price)
  console.log(coin)
  console.log(post)

  if (post.isHidden) return <p>Publication is hidden</p>;

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none',}}>
      <Image dir="ltr" alt={post?.metadata?.title} src={getMediaUri(getWallpaperCid())} ratio="21/9" />

      <Box sx={{
        bottom: 0,
        left: 0,
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
      }} />
      <Box sx={{
        bottom: 0,
        left: 0,
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
      }} />

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ position: 'relative' }}>
        <CardContent
          sx={{
            bottom: 0,
            left: 0,
            zIndex: 9,
            width: '100%',
            textAlign: 'left',
            position: 'absolute',
            color: 'common.white'
          }}
        >
          {/* Title */}
          <Box sx={{ display:'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'end', width: '60%' }}>
              {/* Title */}
              <m.div variants={variants}>
                <Typography sx={{ fontSize: 'clamp(2rem, 1vw, 3rem)', fontWeight: 'bold', lineHeight: 1.1, mb: 0.5 }} gutterBottom>
                  {post?.metadata?.title}
                </Typography>
              </m.div>
              {/* Details: Rating, Year, Genre */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                {/* <Stack direction="row" spacing={0.5} alignItems="center"> */}
                {/*  <IconStarFilled size={14} color="#FFCD19"/> */}
                {/*  <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }} variant="body2">{movie.rating}</Typography> */}
                {/* </Stack> */}
                {/* <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography> */}
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2">{getMovieYear()}</Typography>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
                  { getMovieGenres().split(', ').join('  -  ') }
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
                    {post?.metadata?.content ?? ''}
                  </Typography>
                </m.div>
              </Box>
              <m.div className='flex space-x-6' variants={variants}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {
                    post?.operations?.hasCollected?.value ? (
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
                        <Stack spacing={0.5} direction="row" alignItems="center">
                          <>
                            <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                            <Stack spacing={0.5} direction="column" alignItems="flex-start" justifyContent="flex-start">
                              <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                                Watch it!
                              </Typography>
                            </Stack>
                          </>
                        </Stack>
                      </Button>
                    ) : (
                      <Button
                        variant='contained'
                        sx={{
                          mt: 3 ,
                          color:'#FFFFFF',
                          background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
                          height: '40px'
                        }}
                        onClick={handleCollect}
                      >
                        <Stack spacing={0.5} direction="row" alignItems="center">
                          {
                            loading ? (
                              <CircularProgress size="25px" />
                            ) : (
                              <>
                                <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                                <Stack spacing={0.5} direction="column" alignItems="flex-start" justifyContent="flex-start">
                                  <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                                    Collect!
                                  </Typography>
                                  <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.7vw, 0.7rem)' }}>
                                    {price} {coin}
                                  </Typography>
                                </Stack>
                              </>
                            )
                          }
                        </Stack>
                      </Button>
                    )
                  }
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
                  <Button
                    variant='contained'
                    sx={{
                      mt: 3 ,
                      color:'#FFFFFF',
                      background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
                      height: '40px'
                    }}
                    onClick={handleHide}
                  >
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      {
                        loadingHide ? (
                          <CircularProgress size="25px" />
                        ) : (
                          <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                            Hide
                          </Typography>
                        )
                      }
                    </Stack>
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      height: '40px'
                    }}
                    onClick={toggleReaction}
                    disabled={loadingLike}
                  >
                    {loadingLike ? (
                      <CircularProgress size="25px" />
                    ) : (
                      <>
                        {hasLiked ? (
                          <IconHeartFilled size={22} color='#FFFFFF' />
                        ) : (
                          <IconHeart size={22} color='#FFFFFF' />
                        )}
                      </>
                    )}
                  </Button>
                </Stack>
              </m.div>
            </Box>
            <Box
              sx={{
                width:'200px',
                height:'100%',
                position:'relative',

              }}
            >
              <Box sx={{ width:'200px' }}>
                 <PosterVertical
                   sx={{ height:'100%' }}
                   id={post?.id}
                   title={post?.metadata?.title}
                   genre={getMovieGenres().split(', ')}
                   images={{
                     vertical: getMediaUri(getPosterCid()),
                     horizontal: getMediaUri(getPosterHorizontalCid()),
                     wallpaper: getMediaUri(getWallpaperCid())
                   }}
                   likes={post?.stats?.upvotes ?? 0}
                   synopsis={post?.metadata?.content ?? ''}
                   year={getMovieYear()}
                 />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Container>
    </Paper>
  );
}






