// REACT IMPORTS
import { useEffect, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { useTheme, styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ICONS IMPORTS
import {
  IconMessageCircle,
  IconMessageCircleFilled,
  IconHeart,
  IconHeartFilled,
  IconDots,
  IconBookmark,
  IconBookmarkFilled,
  IconRosetteDiscountCheckFilled,
} from '@tabler/icons-react';

// MOTION IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { varFade } from '@src/components/animate';
import { LeaveTipCard } from '@src/components/leave-tip-card.tsx';
import PostCommentList from '@src/sections/publication/components/publication-comments-list.tsx';
import PublicationCommentForm from '@src/sections/publication/components/publication-details-comment-form.tsx';
import { SubscribeToUnlockCard } from '@src/components/subscribe-to-unlock-card/subscribe-to-unlock-card.tsx';
import Popover from '@mui/material/Popover';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { openLoginModal } from '@redux/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { PublicationDetailProps } from '@src/components/publication-detail-main/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { useToggleBookmark } from '@src/hooks/use-toggle-bookmark';
import {
  useHidePostMutation,
  useGetIsPostLikedLazyQuery,
  useTogglePostLikeMutation,
} from '@src/graphql/generated/hooks.tsx';
import { resolveSrc } from '@src/utils/image.ts';
import { useBookmarks } from '@src/hooks/use-bookmark.ts';
import { RootState } from '@redux/store.ts';
import { decrementCounterLikes, incrementCounterLikes, setCounterLikes } from '@redux/comments';

// ----------------------------------------------------------------------

export default function PublicationDetailMain({
  post,
  handleSubscribe,
  handleRefetchAccess,
  loadingSubscribe,
  subscribeDisabled,
  hasAccess,
}: Readonly<PublicationDetailProps>) {
  const [showComments, setShowComments] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const likesCount = useSelector((s: RootState) => s.comments.counterLikes[post.id] ?? post.likeCount);
  const counters = useSelector((s: RootState) => s.comments.counterLikes);

  const router = useRouter();
  const theme = useTheme();
  const { session: sessionData } = useAuth();
  const dispatch = useDispatch();
  const [ hidePost ] = useHidePostMutation();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);
  const [getIsPostLiked, { data: postLikedData, loading: postLikedLoading }] = useGetIsPostLikedLazyQuery()
  const [ togglePostLike, { loading: togglePostLikeLoading }  ] = useTogglePostLikeMutation()
  const { has, loading: loadingList } = useBookmarks();
  const { toggle, loading: loadingToggle } = useToggleBookmark();
  const commentCount = useSelector((s: RootState) => s.comments.postCommentCount[post.id] ?? post.commentCount);

  const isBookmarked = has(post.id);
  const isLoading = togglePostLikeLoading || postLikedLoading
  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;
  const openMenu = Boolean(anchorEl);

  const toggleReaction = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    // Send a notification to the profile owner using the sendNotification function from useNotifications hook
    const payloadForNotification = generatePayload(
      'LIKE',
      {
        id: post.author.address,
        displayName: post.author.displayName ?? 'Watchit',
        avatar: resolveSrc(post.author.profilePicture || post.author.address, 'profile'),
      },
      {
        rawDescription: `${sessionData?.user?.displayName} liked ${post.title}`,
        root_id: post.id,
        post_title: post.title,
      }
    );

    try {
      const res = await togglePostLike({
        variables: {
          input: {
            postId: post.id
          }
        }
      });

      const isLiked = res?.data?.togglePostLike ?? false;

      setHasLiked(isLiked);
      dispatch(isLiked ? incrementCounterLikes(post.id) : decrementCounterLikes(post.id));

      // Send notification to the author when not already liked
      if (res?.data?.togglePostLike) {
        sendNotification(post.author.address, sessionData?.user?.address ?? '', payloadForNotification);
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  useEffect(() => {
    setHasLiked(postLikedData?.getIsPostLiked ?? false);
  }, [postLikedData]);

  useEffect(() => {
    getIsPostLiked({ variables: { postId: post.id }, fetchPolicy: 'network-only' });
    if (post.likeCount !== undefined) {
      dispatch(setCounterLikes({ publicationId: post.id, likes: post.likeCount }));
    }
  }, [post.likeCount, post.id]);

  const handleHide = async () => {
    await hidePost({ variables: { postId: post.id } });
    router.reload();
  };

  const goToProfile = () => {
    if (!post.author.address) return;

    router.push(paths.dashboard.user.root(`${post.author.address}`));
  };

  if (!post) return <p>The publication does not exist</p>;

  return (
    <Box
      sx={{
        position: 'sticky',
        width: {
          xs: '100%',
          lg: '450px',
        },
        padding: '10px',
        top: '80px',
        height: 'fit-content',
        maxHeight: { xs: 'auto', md: '100vh' },
        flexShrink: 0,
      }}
    >
      <Card
        component={m.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <CardContent
          sx={{
            maxHeight: { xs: 'auto', md: 'calc(100vh - 10rem)' },
            overflowY: 'scroll',
            backgroundColor: '#1e1f22',
            padding: '0 !important',
            margin: '10px 10px 10px 20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              zIndex: 10,
              position: 'sticky',
              top: '0px',
              backgroundColor: '#1e1f22',
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={goToProfile}
            >
              <AvatarProfile
                src={resolveSrc(post.author.profilePicture || post.author.address, 'profile')}
                sx={{
                  width: 26,
                  height: 26,
                  border: 'solid 2px #161C24',
                }}
              />
              <Typography variant="subtitle2" noWrap sx={{ ml: 1 }}>
                {post.author.displayName}
              </Typography>
            </Box>
            {sessionData?.authenticated && post.author.address === sessionData?.user?.address ? (
              <Button
                variant="text"
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  height: '40px',
                  minWidth: '40px',
                }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <IconDots size={22} color="#FFFFFF" />
              </Button>
            ) : (
              <></>
            )}
            <Popover
              open={openMenu}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(90deg, #1C1C1E, #2C2C2E)',
                  borderRadius: 1,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  mt: 1,
                  ml: -3,
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <Stack direction="column" spacing={0} justifyContent="center">
                {post.author.address === sessionData?.user?.address && (
                  <MenuItem
                    onClick={() => {
                      setOpenConfirmModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Hide
                  </MenuItem>
                )}
              </Stack>
            </Popover>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              zIndex: 10,
              top: '2.5rem',
              backgroundColor: '#1e1f22',
            }}
          >
            <m.div variants={variants}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 1.5 }}
                gutterBottom
              >
                {post.title}
              </Typography>
            </m.div>
            <m.div variants={variants}>
              <Stack
                direction="row"
                sx={{ mb: 1.5, cursor: 'pointer' }}
                spacing={0}
                alignItems="center"
              >
                <Typography style={{ marginRight: 5 }} variant="body1">
                  Distributed by
                </Typography>
                <StyledBoxGradient>
                  <Typography style={{ marginRight: 5, fontWeight: 'bold' }} variant="caption">
                    Watchit
                  </Typography>
                  <IconRosetteDiscountCheckFilled />
                </StyledBoxGradient>
              </Stack>
            </m.div>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              mb: 3,
              mt: 1,
              pr: 1,
            }}
          >
            {hasAccess && sessionData?.authenticated ? (
              // @ts-expect-error No error in this context
              <LeaveTipCard post={post} />
            ) : (
              <SubscribeToUnlockCard
                loadingSubscribe={loadingSubscribe}
                subscribeDisabled={subscribeDisabled ?? false}
                handleRefetchAccess={handleRefetchAccess}
                onSubscribe={handleSubscribe}
                post={post}
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              zIndex: 10,
              backgroundColor: '#1e1f22',
            }}
          >
            <m.div className="flex space-x-6" variants={variants}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="text"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                    minWidth: '40px',
                  }}
                  onClick={toggleReaction}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {hasLiked ? (
                        <IconHeartFilled size={22} color="#FFFFFF" />
                      ) : (
                        <IconHeart size={22} color="#FFFFFF" />
                      )}
                      <Typography variant="body2" sx={{ lineHeight: 1, ml: 1, fontWeight: '700' }}>
                        {likesCount}
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
                    minWidth: '40px',
                  }}
                  onClick={() => setShowComments(!showComments)}
                >
                  <>
                    {showComments ? (
                      <IconMessageCircleFilled size={22} color="#FFFFFF" />
                    ) : (
                      <IconMessageCircle size={22} color="#FFFFFF" />
                    )}
                    <Typography variant="body2" sx={{ lineHeight: 1, ml: 1, fontWeight: '700' }}>
                      {commentCount}
                    </Typography>
                  </>
                </Button>
                <Button
                  variant="text"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                    minWidth: '40px',
                  }}
                  onClick={() => toggle(post)}
                >
                  {loadingToggle || loadingList ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {isBookmarked ? (
                        <IconBookmarkFilled size={22} color="#FFFFFF" />
                      ) : (
                        <IconBookmark size={22} color="#FFFFFF" />
                      )}
                    </>
                  )}
                </Button>
              </Stack>
            </m.div>
          </Box>

          {/*Comments*/}
          {showComments && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  pb: 2,
                  zIndex: 10,
                  position: 'sticky',
                  top: '2rem',
                  backgroundColor: '#1e1f22',
                }}
              >
                <Divider sx={{ my: 3, mr: 1 }} />
                {sessionData?.authenticated ? (
                  <PublicationCommentForm
                    root={post.id}
                    commentOn={null}
                    owner={{
                      id: post.author.address,
                      displayName: post.author.displayName ?? 'Watchit',
                      avatar: resolveSrc(post.author.profilePicture || post.author.address, 'profile'),
                    }}
                  />
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
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, pr: 1 }}>
                <PostCommentList publicationId={post.id} showReplies />
              </Box>
            </Box>
          )}

          <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
            <DialogTitle>Confirm hide</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to hide this publication?</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                sx={{ borderColor: '#fff' }}
                onClick={() => setOpenConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#fff' }}
                onClick={() => {
                  handleHide();
                  setOpenConfirmModal(false);
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}

const StyledBoxGradient = styled(Box)(({ theme }) => ({
  background: `linear-gradient(300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%)`,
  backgroundSize: '400%',
  animation: 'gradientShift 20s infinite',
  padding: '4px 10px',
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));
