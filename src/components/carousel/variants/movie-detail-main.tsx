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
import {
  IconPlayerPlay,
  IconFlagFilled,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconHeart,
  IconHeartFilled,
  IconDots, IconBookmark,
} from '@tabler/icons-react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { TokenAllowanceLimit, useApproveModule, PublicationReactionType, hasReacted, useReactionToggle } from '@lens-protocol/react-web';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OpenActionKind, useHidePublication, useOpenAction } from '@lens-protocol/react';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useSettingsContext } from '../../settings';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import { PosterVertical } from '../../poster';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Label from '@src/components/label';
import PostCommentList from '@src/sections/movie/movie-comments-list.tsx';
import MovieCommentForm from '@src/sections/movie/movie-details-comment-form.tsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useAuth } from '@src/hooks/use-auth.ts';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import { LeaveTipCard } from '@src/components/carousel/variants/leave-tip-card.tsx';
import { SubscribeToUnlockCard } from '@src/components/carousel/variants/subscribe-to-unlock-card.tsx';

// ----------------------------------------------------------------------

type Props = {
  post: any
  handleSubscribe: () => void
};

export default function MovieDetailMain({ post, handleSubscribe }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [hasCollected, setHasCollected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false)
  const [selectedTip, setSelectedTip] = useState('10');
  const [customTip, setCustomTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const price = post?.openActionModules?.[0]?.amount?.value ?? ''
  const coin = post?.openActionModules?.[0]?.amount?.asset?.symbol ?? ''
  const { selectedProfile } = useAuth();
  const { execute: collect, loading } = useOpenAction({
    action: { kind: OpenActionKind.COLLECT }
  });
  const approve = useApproveModule({
    limit: TokenAllowanceLimit.INFINITE,
  });
  const { execute: hide, loading: loadingHide } = useHidePublication();
  const { execute: toggle, loading: loadingLike} = useReactionToggle();
  const [hasLiked, setHasLiked] = useState(hasReacted({ publication: post, reaction: PublicationReactionType.Upvote }));
  const [showComments, setShowComments] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

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

  const handleHide = async () => {
    console.log('handle hide')
    await hide({ publication: post })
    console.log('publication hided')
  };

  const goToProfile = () => {
    if (!post?.by?.id) return;

    router.push(paths.dashboard.user.root(`${post?.by?.id}`))
  }

  const handleSubscription = () => {
    setHasAccess(true)
    handleSubscribe()
  };

  console.log('hello price and coin')
  console.log(price)
  console.log(coin)
  console.log(post)

  if (post.isHidden) return <p>Publication is hidden</p>;

  return (
    <Box sx={{ position: 'sticky', top: '75px', paddingTop: '10px', width: '450px', height: 'fit-content', maxHeight: '100vh', flexShrink: 0 }}>
      <Card
        component={m.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <CardContent
          sx={{
            maxHeight: 'calc(100vh - 10rem)',
            overflowY: 'scroll',
            backgroundColor: '#1e1f22',
            padding: '0 !important',
            margin: '24px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              zIndex: 1,
              position: 'sticky',
              top: '0px',
              backgroundColor: '#1e1f22'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={goToProfile}>
              <Avatar
                src={(post?.by?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${post?.by?.id}`}
                sx={{
                  width: 26,
                  height: 26,
                  border: (theme) => `solid 2px ${theme.palette.background.default}`,
                }}
              />
              <Typography variant="subtitle2" noWrap sx={{ ml: 1 }}>
                {post?.by?.metadata?.displayName}
              </Typography>
            </Box>
            <Button
              variant="text"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                height: '40px',
                minWidth: '40px'
              }}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <IconDots size={22} color='#FFFFFF' />
            </Button>
            <Menu
              id="dots-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => { setOpenConfirmModal(true); setAnchorEl(null); }}>Hide</MenuItem>
              <MenuItem onClick={() => { /* Manejar acción de reportar */ setAnchorEl(null); }}>Report</MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'end',
              zIndex: 1,
              position: 'sticky',
              top: '2.5rem',
              backgroundColor: '#1e1f22'
            }}
          >
            <m.div variants={variants}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 2 }} gutterBottom>
                {post?.metadata?.title}
              </Typography>
            </m.div>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mb: 3, mt: 1 }}>
            {hasAccess ? (
              <LeaveTipCard />
            ) : (
              <SubscribeToUnlockCard onSubscribe={handleSubscription} />
            )}
          </Box>

          {/*<Box sx={{ display:'flex', flexDirection:'column', justifyContent:'end', mb: 3 }}>*/}
          {/*  /!*<Box>*!/*/}
          {/*  /!*  <m.div  variants={variants}>*!/*/}
          {/*  /!*    <Typography*!/*/}
          {/*  /!*      sx={{*!/*/}
          {/*  /!*        overflow: 'hidden',*!/*/}
          {/*  /!*        textOverflow: 'ellipsis',*!/*/}
          {/*  /!*        display: '-webkit-box',*!/*/}
          {/*  /!*        WebkitLineClamp: '5',*!/*/}
          {/*  /!*        WebkitBoxOrient: 'vertical',*!/*/}
          {/*  /!*        fontWeight: '700'*!/*/}
          {/*  /!*      }}*!/*/}
          {/*  /!*      variant="body2"*!/*/}
          {/*  /!*      color="text.secondary"*!/*/}
          {/*  /!*    >*!/*/}
          {/*  /!*      {post?.metadata?.content ?? ''}*!/*/}
          {/*  /!*    </Typography>*!/*/}
          {/*  /!*  </m.div>*!/*/}
          {/*  /!*</Box>*!/*/}
          {/*  <Card*/}
          {/*    component={m.div}*/}
          {/*    initial={{ opacity: 0 }}*/}
          {/*    animate={{ opacity: 1 }}*/}
          {/*    transition={{ duration: 0.5 }}*/}
          {/*    sx={{*/}
          {/*      backgroundColor: '#2B2D31',*/}
          {/*      mt: 2*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>*/}
          {/*      <Stack direction="column" spacing={1}>*/}
          {/*        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 , fontWeight: '700'}}>*/}
          {/*          Price*/}
          {/*        </Typography>*/}
          {/*        <Typography variant="h6" sx={{ lineHeight: 1 , fontWeight: '700'}}>*/}
          {/*          {price} {coin}*/}
          {/*        </Typography>*/}
          {/*      </Stack>*/}
          {/*      <Stack direction="row" spacing={1} alignItems="center">*/}
          {/*        {*/}
          {/*          post?.operations?.hasCollected?.value ? (*/}
          {/*            <Button*/}
          {/*              variant='contained'*/}
          {/*              sx={{*/}
          {/*                color: '#1E1F22',*/}
          {/*                background: '#FFFFFF',*/}
          {/*                height: '40px'*/}
          {/*              }}*/}
          {/*              onClick={() => {}}*/}
          {/*              disabled={true}*/}
          {/*            >*/}
          {/*              <Typography variant="body2" sx={{ lineHeight: 1 , fontWeight: '700'}}>*/}
          {/*                You has already access*/}
          {/*              </Typography>*/}
          {/*            </Button>*/}
          {/*          ) : (*/}
          {/*            <Button*/}
          {/*              variant='contained'*/}
          {/*              sx={{*/}
          {/*                color: '#1E1F22',*/}
          {/*                background: '#FFFFFF',*/}
          {/*                height: '40px'*/}
          {/*              }}*/}
          {/*              onClick={handleCollect}*/}
          {/*            >*/}
          {/*              <Stack spacing={0.5} direction="row" alignItems="center">*/}
          {/*                {*/}
          {/*                  loading ? (*/}
          {/*                    <CircularProgress size="25px" sx={{ color: '#1E1F22' }} />*/}
          {/*                  ) : (*/}
          {/*                    <Typography variant="body2" sx={{ lineHeight: 1 , fontWeight: 'bold'}}>*/}
          {/*                      Get access!*/}
          {/*                    </Typography>*/}
          {/*                  )*/}
          {/*                }*/}
          {/*              </Stack>*/}
          {/*            </Button>*/}
          {/*          )*/}
          {/*        }*/}
          {/*      </Stack>*/}
          {/*    </CardContent>*/}
          {/*  </Card>*/}

          {/*</Box>*/}
          <Box
            sx={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'end',
              zIndex: 1,
              position: 'sticky',
              top: '4.6rem',
              backgroundColor: '#1e1f22'
            }}
          >
            <m.div className='flex space-x-6' variants={variants}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="text"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                    minWidth: '40px'
                  }}
                  onClick={toggleReaction}
                  disabled={loadingLike}
                >
                  {loadingLike ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {hasLiked ? (
                        <IconHeartFilled size={22} color='#FFFFFF' />
                      ) : (
                        <IconHeart size={22} color='#FFFFFF' />
                      )}
                      <Typography variant="body2" sx={{ lineHeight: 1, ml: 1, fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                        {post?.stats?.upvotes}
                      </Typography>
                    </>
                  )}
                </Button>
                <Button
                  variant="text"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                    minWidth: '40px'
                  }}
                  onClick={() => setShowComments(!showComments)}
                >
                  <>
                    {showComments ? (
                      <IconMessageCircleFilled size={22} color='#FFFFFF' />
                    ) : (
                      <IconMessageCircle size={22} color='#FFFFFF' />
                    )}
                    <Typography variant="body2" sx={{ lineHeight: 1, ml: 1, fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                      {post?.stats?.comments}
                    </Typography>
                  </>
                </Button>
                <Button
                  variant="text"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                    minWidth: '40px'
                  }}
                  onClick={() => {}}
                >
                  <IconBookmark size={22} color='#FFFFFF' />
                </Button>
              </Stack>
            </m.div>
          </Box>

          {/*Comments*/}
          {showComments && (
            <Box
              sx={{
                display:'flex',
                flexDirection:'column'
              }}
            >
              <Box
                sx={{
                  display:'flex',
                  flexDirection:'column',
                  pb: 2,
                  zIndex: 1,
                  position: 'sticky',
                  top: '6.6rem',
                  backgroundColor: '#1e1f22'
                }}
              >
                <Divider sx={{ my: 3 }} />
                {selectedProfile ? (
                  <MovieCommentForm commentOn={post?.id} />
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: '#2B2D31',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    Login to leave a comment
                  </Typography>
                )}
              </Box>
              <Box sx={{ display:'flex', flexDirection:'column', mt: 2 }}>
                <PostCommentList publicationId={post?.id} showReplies />
              </Box>
            </Box>
          )}

          <Dialog
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
          >
            <DialogTitle>Confirm Hide</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to hide this publication?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmModal(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => { handleHide(); setOpenConfirmModal(false); }} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}
