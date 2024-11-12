import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import MovieCommentForm from './movie-details-comment-form';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import { CircularProgress } from '@mui/material';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconMessageCircleFilled } from '@tabler/icons-react';
import Typography from '@mui/material/Typography';
import { hasReacted, PublicationReactionType, useReactionToggle } from '@lens-protocol/react-web';
import { useState } from 'react';
import RepliesList from '@src/sections/movie/movie-replies-list.tsx';
import { timeAgo } from '@src/utils/comment.ts';

// ----------------------------------------------------------------------

type Props = {
  comment: any
  hasReply?: boolean;
  canReply?: boolean;
};

export default function MovieCommentItem({
                                           comment,
                                           hasReply,
                                           canReply,
                                         }: Props) {
  const router = useRouter();
  const { execute: toggle, loading: loadingLike} = useReactionToggle();
  const [hasLiked, setHasLiked] = useState(hasReacted({ publication: comment, reaction: PublicationReactionType.Upvote }));
  // const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const toggleReaction = async () => {
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
    if (!comment?.profile?.id) return;

    router.push(paths.dashboard.user.root(`${comment?.profile?.id}`))
  }

  console.log('hello comment')
  console.log(comment)

  return (
    <Stack
      sx={{
        ...(hasReply && {
          pl: 8, // Indent replies
        }),
        ...(!hasReply && {
          pt: 1,
        })
      }}
      direction="column"
      spacing={2}
    >
      <Stack
        direction="column"
        spacing={1}
      >
        <Stack
          direction="row"
          spacing={2}
        >
           <Avatar
            src={(comment?.by?.metadata?.picture as any)?.optimized?.uri ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${comment?.by?.id}`}
            alt={comment?.by?.id} onClick={goToProfile}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
           />

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

              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ ml: 1 }}>
                <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                  {comment?.createdAt ? timeAgo(new Date(comment.createdAt)) : 'Just now'}
                </Box>
              </Box>
            </Stack>

            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{comment?.metadata?.content}</Box>
          </Paper>
        </Stack>
        <Box sx={{ display: 'flex', pl: 7 }}>
          <Button
            variant="text"
            sx={{
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              height: '30px',
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
            <MovieCommentForm commentOn={comment?.id} />
          </Box>
          <RepliesList parentCommentId={comment.id} canReply={canReply} />
        </>
      )}
    </Stack>
  );
}
