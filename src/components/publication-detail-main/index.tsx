// REACT IMPORTS
import { useState } from 'react';

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

// LENS IMPORTS
import {
  PublicationReactionType,
  hasReacted,
  useReactionToggle,
  useBookmarkToggle,
} from '@lens-protocol/react-web';
import { useHidePublication } from '@lens-protocol/react';

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
import { ReportPublicationModal } from '@src/components/report-publication-modal.tsx';
import Popover from '@mui/material/Popover';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux';
import { addBookmark, removeBookmark } from '@redux/bookmark';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import {dicebear} from "@src/utils/dicebear.ts";
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { PublicationDetailProps } from '@src/components/publication-detail-main/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';

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
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasLiked, setHasLiked] = useState(
    hasReacted({ publication: post, reaction: PublicationReactionType.Upvote })
  );

  const router = useRouter();
  const theme = useTheme();
  const { session: sessionData } = useAuth();
  const dispatch = useDispatch();
  const { execute: toggle, loading: loadingLike } = useReactionToggle();
  const { execute: hide } = useHidePublication();
  const { execute: toggleBookMarkFunction, loading: loadingBookMark } = useBookmarkToggle();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;
  const openMenu = Boolean(anchorEl);

  const toggleReaction = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    // Send a notification to the profile owner using the sendNotification function from useNotifications hook
    const payloadForNotification = generatePayload(
      'LIKE',
      {
        id: post.by.id,
        displayName: post?.by?.metadata?.displayName,
        avatar:
          post?.by?.metadata?.picture?.optimized?.uri ?? dicebear(post?.by?.id),
      },
      {
        rawDescription: `${sessionData?.profile?.metadata?.displayName} liked ${post?.metadata?.title}`,
        root_id: post?.id,
        post_title: post?.metadata?.title,
      }
    );

    try {
      await toggle({
        reaction: PublicationReactionType.Upvote,
        publication: post,
      }).then(() => {
        // Send notification to the author when not already liked
        if (!hasLiked) {
          sendNotification(post.by.id, sessionData?.profile?.id, payloadForNotification);
        }
      });
      setHasLiked(!hasLiked); // Toggle the UI based on the reaction state
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const toggleBookMark = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    try {
      if (!post?.operations?.hasBookmarked) {
        dispatch(addBookmark(post));
      } else {
        dispatch(removeBookmark(post?.id));
      }

      await toggleBookMarkFunction({
        publication: post,
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleHide = async () => {
    await hide({ publication: post });
  };

  const goToProfile = () => {
    if (!post?.by?.id) return;

    router.push(paths.dashboard.user.root(`${post?.by?.id}`));
  };

  if (post.isHidden) return <p>Publication is hidden</p>;

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
                src={
                  (post?.by?.metadata?.picture)?.optimized?.uri ?? post?.by?.id
                }
                sx={{
                  width: 26,
                  height: 26,
                  border: (theme: any) => `solid 2px ${theme.palette.background.default}`,
                }}
              />
              <Typography variant="subtitle2" noWrap sx={{ ml: 1 }}>
                {post?.by?.metadata?.displayName}
              </Typography>
            </Box>
            {sessionData?.authenticated ? (
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
                {post?.by?.ownedBy?.address === sessionData?.profile?.ownedBy?.address && (
                  <MenuItem
                    onClick={() => {
                      setOpenConfirmModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Hide
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setOpenReportModal(true);
                    setAnchorEl(null);
                  }}
                >
                  Report
                </MenuItem>
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
                {post?.metadata?.title}
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
              // @ts-ignore
              <LeaveTipCard post={post} />
            ) : (
              <SubscribeToUnlockCard
                loadingSubscribe={loadingSubscribe}
                subscribeDisabled={subscribeDisabled}
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
                  disabled={loadingLike}
                >
                  {loadingLike ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {hasLiked ? (
                        <IconHeartFilled size={22} color="#FFFFFF" />
                      ) : (
                        <IconHeart size={22} color="#FFFFFF" />
                      )}
                      <Typography variant="body2" sx={{ lineHeight: 1, ml: 1, fontWeight: '700' }}>
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
                    minWidth: '40px',
                  }}
                  onClick={toggleBookMark}
                >
                  {loadingBookMark ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {post?.operations?.hasBookmarked ? (
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
                    root={post?.id}
                    commentOn={post?.id}
                    owner={{
                      id: post?.by?.id,
                      displayName: post?.by?.metadata?.displayName,
                      avatar:
                        post?.by?.metadata?.picture?.optimized?.uri ?? dicebear(post?.by?.id),
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
                <PostCommentList publicationId={post?.id} showReplies />
              </Box>
            </Box>
          )}

          <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
            <DialogTitle>Confirm Hide</DialogTitle>
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

          {/* Report Publication Modal */}
          <ReportPublicationModal
            post={post}
            isOpen={openReportModal}
            onClose={() => setOpenReportModal(false)}
          />
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
