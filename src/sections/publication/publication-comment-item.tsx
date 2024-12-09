import { useState, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import PublicationCommentForm from './publication-details-comment-form';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import { CircularProgress } from '@mui/material';
import {
  IconDots,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconMessageCircleFilled,
} from '@tabler/icons-react';
import Typography from '@mui/material/Typography';
import {
  hasReacted,
  ProfileSession,
  PublicationReactionType,
  useReactionToggle,
  useSession,
} from '@lens-protocol/react-web';
import RepliesList from '@src/sections/publication/publication-replies-list.tsx';
import { timeAgo } from '@src/utils/comment.ts';
import { openLoginModal } from '@redux/auth';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { useDispatch } from 'react-redux';

import { useHidePublication } from '@lens-protocol/react';
import { hiddeComment } from '@redux/comments';

// Components Lazy
const LazyPopover = lazy(() => import('@mui/material/Popover'));
const LazyMenuItem = lazy(() => import('@mui/material/MenuItem'));
const LazyDialog = lazy(() => import('@mui/material/Dialog'));
const LazyDialogTitle = lazy(() => import('@mui/material/DialogTitle'));
const LazyDialogContent = lazy(() => import('@mui/material/DialogContent'));
const LazyDialogActions = lazy(() => import('@mui/material/DialogActions'));

// ----------------------------------------------------------------------

type Props = {
  comment: any;
  hasReply?: boolean;
  canReply?: boolean;
};

export default function PublicationCommentItem({ comment, hasReply, canReply }: Props) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();
  const { execute: toggle, loading: loadingLike } = useReactionToggle();
  const [hasLiked, setHasLiked] = useState(
    hasReacted({ publication: comment, reaction: PublicationReactionType.Upvote })
  );
  const { execute: hide } = useHidePublication();
  const [showComments, setShowComments] = useState(false);
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const dispatch = useDispatch();

  const toggleReaction = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    try {
      await toggle({
        reaction: PublicationReactionType.Upvote,
        publication: comment,
      });
      setHasLiked(!hasLiked); // Toggle the UI based on the reaction state
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const goToProfile = () => {
    if (!comment?.by?.id) return;

    router.push(paths.dashboard.user.root(`${comment?.by?.id}`));
  };

  const handleHide = async () => {
    await hide({ publication: comment });
    dispatch(hiddeComment(comment));
  };

  return (
    <Stack
      sx={{
        ...(hasReply && {
          pl: 8, // Indent replies
        }),
        ...(!hasReply && {
          pt: 1,
        }),
      }}
      direction="column"
      spacing={2}
    >
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
          <Avatar
            src={
              (comment?.by?.metadata?.picture as any)?.optimized?.uri ??
              `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${comment?.by?.id}`
            }
            alt={comment?.by?.id}
            onClick={goToProfile}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          />

          {sessionData?.authenticated && (
            <Button
              variant="text"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                height: '30px',
                minWidth: '30px',
                position: 'absolute',
                top: 5,
                right: 5
              }}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <IconDots size={22} color="#FFFFFF" />
            </Button>
          )}

          {/* Suspense para Popover */}
          <Suspense fallback={<></>}>
            {openMenu && (
              <LazyPopover
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
                    mt: 0,
                    ml: -3,
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  },
                }}
              >
                <Stack direction="column" spacing={0} justifyContent="center">
                  {comment?.by?.ownedBy?.address === sessionData?.profile?.ownedBy?.address && (
                    <LazyMenuItem
                      onClick={() => {
                        setOpenConfirmModal(true);
                        setAnchorEl(null);
                      }}
                    >
                      Hide
                    </LazyMenuItem>
                  )}
                </Stack>
              </LazyPopover>
            )}
          </Suspense>

          <Paper
            sx={{
              p: 1.5,
              pt: 0.7,
              flexGrow: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack
              sx={{ mb: 0.5 }}
              alignItems={{ sm: 'center' }}
              justifyContent="flex-start"
              direction={{ xs: 'column', sm: 'row' }}
            >
              <Box sx={{ typography: 'subtitle2' }}>{comment?.by?.handle?.localName}</Box>

              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                sx={{ ml: 1 }}
              >
                <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                  {comment?.createdAt ? timeAgo(new Date(comment.createdAt)) : 'Just now'}
                </Box>
              </Box>
            </Stack>

            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
              {comment?.metadata?.content}
            </Box>
          </Paper>
        </Stack>
        <Box sx={{ display: 'flex', pl: 7 }}>
          <Button
            variant="text"
            sx={{
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              height: '30px',
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
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1,
                    ml: 1,
                    fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)',
                    fontWeight: '700',
                  }}
                >
                  {comment?.stats?.upvotes}
                </Typography>
              </>
            )}
          </Button>
          {canReply && (
            <Button
              variant="text"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                height: '30px',
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
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1,
                    ml: 1,
                    fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)',
                    fontWeight: '700',
                  }}
                >
                  {comment?.stats?.comments}
                </Typography>
              </>
            </Button>
          )}
        </Box>
      </Stack>
      {showComments && (
        <>
          <Box sx={{ mt: 1, mb: 2, ml: 8 }}>
            {sessionData?.authenticated ? (
              <PublicationCommentForm commentOn={comment?.id} />
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
          <RepliesList parentCommentId={comment.id} canReply={canReply} />
        </>
      )}

      {/* Suspense para Dialog */}
      <Suspense fallback={<></>}>
        {openConfirmModal && (
          <LazyDialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
            <LazyDialogTitle>Confirm Hide</LazyDialogTitle>
            <LazyDialogContent>
              <Typography>Are you sure you want to hide this publication?</Typography>
            </LazyDialogContent>
            <LazyDialogActions>
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
            </LazyDialogActions>
          </LazyDialog>
        )}
      </Suspense>
    </Stack>
  );
}
