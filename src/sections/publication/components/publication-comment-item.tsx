import { useEffect, useState, lazy, Suspense, FC } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import PublicationCommentForm from './publication-details-comment-form.tsx';
import { paths } from '../../../routes/paths.ts';
import { useRouter } from '@src/routes/hooks';
import { CircularProgress } from '@mui/material';
import {
  IconDots,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconMessageCircleFilled,
} from '@tabler/icons-react';
import Typography from '@mui/material/Typography';
import RepliesList from '@src/sections/publication/components/publication-replies-list.tsx';
import { timeAgo } from '@src/utils/comment.ts';
import { openLoginModal } from '@redux/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNotificationPayload } from '@src/hooks/use-notification-payload.ts';
import { useNotifications } from '@src/hooks/use-notifications.ts';
import { RootState } from '@redux/store.ts';
import {
  incrementCounterLikes,
  decrementCounterLikes,
  setCounterLikes,
  hiddeComment,
  decrementRepliesCount, decrementPostCommentCount,
} from '@redux/comments';
import AvatarProfile from "@src/components/avatar/avatar.tsx";
import { PublicationCommentItemProps } from '@src/sections/publication/types.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { resolveSrc } from '@src/utils/image.ts';
import {
  useHideCommentMutation, useGetIsCommentLikedQuery,
  useToggleCommentLikeMutation,
} from '@src/graphql/generated/hooks.tsx';

// Components Lazy
const LazyPopover = lazy(() => import('@mui/material/Popover'));
const LazyMenuItem = lazy(() => import('@mui/material/MenuItem'));
const LazyDialog = lazy(() => import('@mui/material/Dialog'));
const LazyDialogTitle = lazy(() => import('@mui/material/DialogTitle'));
const LazyDialogContent = lazy(() => import('@mui/material/DialogContent'));
const LazyDialogActions = lazy(() => import('@mui/material/DialogActions'));

// ----------------------------------------------------------------------

const PublicationCommentItem:FC<PublicationCommentItemProps> = (props) => {
  const { comment, hasReply, canReply } = props;
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();
  const { data: commentLikedData, loading: commentLikedLoading } = useGetIsCommentLikedQuery({ variables: { commentId: comment?.id } })
  const [ toggleCommentLike, { loading: toggleCommentLikeLoading }  ] = useToggleCommentLikeMutation()
  const [ hideComment ] = useHideCommentMutation();
  const { session: sessionData } = useAuth();
  const dispatch = useDispatch();
  const { sendNotification } = useNotifications();
  const { generatePayload } = useNotificationPayload(sessionData);
  const likes = useSelector((state: RootState) => state.comments.counterLikes[comment.id] ?? 0);
  const replies = useSelector((s: RootState) => s.comments.commentRepliesCount[comment.id] ?? comment.repliesCount);

  const openMenu = Boolean(anchorEl);
  const isLoading = toggleCommentLikeLoading || commentLikedLoading

  const toggleReaction = async () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    // Send notification to the author of the comment
    const notificationPayload = generatePayload(
      'LIKE',
      {
        id: comment?.author?.address,
        displayName: comment?.author?.displayName ?? 'no name',
        avatar: resolveSrc(comment?.author?.profilePicture || comment?.author?.address, 'profile'),
      },
      {
        root_id: comment?.post?.id ?? comment?.parentComment?.id,
        parent_id: comment?.parentComment?.id ?? '',
        comment_id: comment?.id,
        rawDescription: `${sessionData?.user?.displayName} liked your comment`,
      }
    );

    try {
      const res = await toggleCommentLike({
        variables: {
          input: {
            commentId: comment?.id
          }
        }
      });
      const isLiked = res?.data?.toggleCommentLike ?? false

      if (isLiked) {
        dispatch(incrementCounterLikes(comment.id));
      } else {
        dispatch(decrementCounterLikes(comment.id));
      }

      if (isLiked && comment?.author?.address !== sessionData?.user?.address) {
        sendNotification(comment?.author?.address, sessionData?.user?.address ?? '', notificationPayload);
      }

      setHasLiked(isLiked); // Toggle the UI based on the reaction state
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const goToProfile = () => {
    if (!comment?.author?.address) return;

    router.push(paths.dashboard.user.root(`${comment?.author?.address}`));
  };

  const handleHide = async () => {
    const parentId = comment?.parentComment?.id
    await hideComment({ variables: { commentId: comment?.id } });

    dispatch(parentId ? decrementRepliesCount(parentId) : decrementPostCommentCount(comment.post.id));
    dispatch(hiddeComment(comment));
  };

  useEffect(() => {
    setHasLiked(commentLikedData?.getIsCommentLiked ?? false);
  }, [commentLikedData]);

  useEffect(() => {
    if (comment?.likeCount !== undefined) {
      dispatch(setCounterLikes({ publicationId: comment.id, likes: comment.likeCount }));
    }
  }, [comment?.likeCount, comment.id, dispatch]);

  const getCommentTimeText = () => {
    if (comment?.createdAt) {
      return timeAgo(new Date(comment.createdAt));
    }

    return 'Just now';
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
          <AvatarProfile
            src={resolveSrc(comment?.author?.profilePicture || comment?.author?.address, 'profile')}
            alt={comment?.author?.address}
            onClick={goToProfile}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              border: 'solid 2px #161C24',
            }}
          />

          {sessionData?.authenticated &&
            comment?.author?.address === sessionData?.user?.address && (
              <Button
                variant="text"
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  height: '30px',
                  minWidth: '30px',
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  zIndex: 1,
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
                  {comment?.author?.address === sessionData?.user?.address && (
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
              flexGrow: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack
              sx={{ mb: 0.5, px: 1, py: 0.5 }}
              alignItems={{ sm: 'center' }}
              justifyContent="flex-start"
              direction={'row'}
              gap={1}
            >
              <Box sx={{ typography: 'subtitle2' }}>{comment?.author?.displayName ?? comment?.author?.username}</Box>
              <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                {getCommentTimeText()}
              </Box>
            </Stack>

            <Box sx={{ typography: 'body2', color: 'text.secondary', p: 1, mt: -1.5 }}>
              {comment?.content}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size="25px" sx={{ color: '#fff' }} />
            ) : (
              <>
                {hasLiked ? (
                  <IconHeartFilled size={22} color="#FFFFFF" />
                ) : (
                  <IconHeart
                    size={22}
                    color={'#FFFFFF'}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1,
                    ml: 1,
                    fontWeight: '700',
                  }}
                >
                  {likes}
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
                  <IconMessageCircle
                    size={22}
                    color={'#FFFFFF'}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1,
                    ml: 1,
                    fontWeight: '700',
                  }}
                >
                  {replies}
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
              <PublicationCommentForm
                root={comment?.post?.id}
                commentOn={comment?.id}
                owner={{
                  id: comment?.author?.address,
                  displayName: comment?.author?.displayName,
                  avatar: resolveSrc(comment?.author?.profilePicture || comment?.author?.address, 'profile'),
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
          <RepliesList parentCommentId={comment.id} canReply={canReply} />
        </>
      )}

      {/* Suspense para Dialog */}
      <Suspense fallback={<></>}>
        {openConfirmModal && (
          <LazyDialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
            <LazyDialogTitle>Confirm Hide</LazyDialogTitle>
            <LazyDialogContent>
              <Typography>Are you sure you want to hide this comment?</Typography>
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

export default PublicationCommentItem;
