// REACT IMPORTS
import { useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
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
  useBookmarkToggle
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
  IconBookmarkFilled, IconRosetteDiscountCheckFilled,
} from '@tabler/icons-react';

// MOTION IMPORTS
import { m } from 'framer-motion';

// LOCAL IMPORTS
import { paths } from '@src/routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { useAuth } from '@src/hooks/use-auth.ts';
import { varFade } from '@src/components/animate';
import { LeaveTipCard } from '@src/components/leave-tip-card.tsx';
import PostCommentList from '@src/sections/publication/publication-comments-list.tsx';
import PublicationCommentForm from '@src/sections/publication/publication-details-comment-form.tsx';
import { SubscribeToUnlockCard } from '@src/components/subscribe-to-unlock-card.tsx';
import { ReportPublicationModal } from '@src/components/report-publication-modal.tsx';
import Popover from '@mui/material/Popover';

// ----------------------------------------------------------------------

type Props = {
  post: any
  handleSubscribe: () => void
  hasAccess: boolean
};

// ----------------------------------------------------------------------

export default function PublicationDetailMain({ post, handleSubscribe, hasAccess }: Props) {
  // STATES HOOKS
  const [showComments, setShowComments] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasLiked, setHasLiked] = useState(hasReacted({ publication: post, reaction: PublicationReactionType.Upvote }));
  const openMenu = Boolean(anchorEl);
  // LOCAL HOOKS
  const router = useRouter();
  const theme = useTheme();
  const { selectedProfile } = useAuth();
  // LENS HOOKS
  const { execute: toggle, loading: loadingLike} = useReactionToggle();
  const { execute: hide, loading: loadingHide } = useHidePublication();
  const { execute: toggleBookMarkFunction, loading: loadingBookMark } = useBookmarkToggle();
  // CONSTANTS
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

  const toggleBookMark = async () => {
    try {
      await toggleBookMarkFunction({
        publication: post
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
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
                {post?.by?.ownedBy?.address === selectedProfile?.ownedBy?.address && (
                  <MenuItem onClick={() => { setOpenConfirmModal(true); setAnchorEl(null); }}>Hide</MenuItem>
                )}
                <MenuItem onClick={() => { setOpenReportModal(true); setAnchorEl(null); }}>Report</MenuItem>
              </Stack>
            </Popover>
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
              <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 1.5 }} gutterBottom>
                {post?.metadata?.title}
              </Typography>
            </m.div>
            <m.div variants={variants}>
              <Stack direction="row" sx={{ mb: 1.5 }} spacing={0} alignItems="center" onClick={() => alert('Clicked') }>
                <Typography style={{ marginRight: 5, fontWeight: 'bold'}} variant='caption'>
                  Handled by
                </Typography>
                <StyledBoxGradient>
                  <Typography style={{ marginRight: 5, fontWeight: 'bold'}} variant='caption'>
                    Watchit
                  </Typography>
                  <IconRosetteDiscountCheckFilled />
                </StyledBoxGradient>
              </Stack>
            </m.div>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mb: 3, mt: 1 }}>
            {hasAccess ? (
              <LeaveTipCard post={post} />
            ) : (
              <SubscribeToUnlockCard onSubscribe={handleSubscribe} />
            )}
          </Box>

          <Box
            sx={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'end',
              zIndex: 1,
              position: 'sticky',
              top: '4.5rem',
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
                  onClick={toggleBookMark}
                >
                  {loadingBookMark ? (
                    <CircularProgress size="25px" sx={{ color: '#fff' }} />
                  ) : (
                    <>
                      {post.operations.hasBookmarked ? (
                        <IconBookmarkFilled size={22} color='#FFFFFF' />
                      ) : (
                        <IconBookmark size={22} color='#FFFFFF' />
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
                  <PublicationCommentForm commentOn={post?.id} />
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
                onClick={() => { handleHide(); setOpenConfirmModal(false); }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Report Publication Modal */}
          <ReportPublicationModal post={post} isOpen={openReportModal} onClose={() => setOpenReportModal(false)} />
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
