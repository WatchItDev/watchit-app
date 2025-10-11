import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import AvatarProfile from '@src/components/avatar/avatar';
import PublicationCommentForm from './publication-details-comment-form';
import RepliesList from '@src/sections/publication/components/publication-replies-list';
import { timeAgo } from '@src/utils/comment';
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux';
import { useAuth } from '@src/hooks/use-auth';
import { resolveSrc } from '@src/utils/image';
import type { PublicationCommentItemProps } from '@src/sections/publication/types';

const PublicationCommentItem = ({
  comment,
  hasReply,
  onReplyCreated,
  showReplies = true,
}: PublicationCommentItemProps) => {
  const dispatch = useDispatch();
  const { session } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  const author = comment.base?.user ?? null;
  const authorAddress = author?.address ?? '';
  const createdAt = comment.base?.createdAt ? new Date(comment.base.createdAt) : null;

  const displayName = useMemo(() => {
    return author?.displayName ?? author?.profile?.username ?? 'Watchit user';
  }, [author?.displayName, author?.profile?.username]);

  const handleReplyClick = () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setShowReplyForm((prev) => !prev);
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1.5,
        bgcolor: alpha('#0F1115', hasReply ? 0.5 : 0.7),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <AvatarProfile
          src={resolveSrc(authorAddress, 'profile')}
          alt={displayName}
          sx={{ width: 40, height: 40 }}
        />
        <Stack spacing={0.5} flex={1}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {displayName}
            </Typography>
            {authorAddress && (
              <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                @{authorAddress.slice(0, 8)}…
              </Typography>
            )}
            {createdAt && (
              <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                {timeAgo(createdAt)}
              </Typography>
            )}
          </Stack>

          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.85) }}>
            {comment.body}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1 }}>
            {showReplies && (
              <Button
                size="small"
                variant="text"
                onClick={() => setRepliesOpen((prev) => !prev)}
                sx={{ color: alpha('#FFFFFF', 0.7), textTransform: 'none', px: 0 }}
              >
                {repliesOpen ? 'Ocultar respuestas' : 'Ver respuestas'}
              </Button>
            )}
            <Button
              size="small"
              variant="text"
              onClick={handleReplyClick}
              sx={{ color: alpha('#FFFFFF', 0.7), textTransform: 'none', px: 0 }}
            >
              Responder
            </Button>
          </Stack>

          {showReplyForm && (
            <Box sx={{ mt: 1 }}>
              <PublicationCommentForm
                commentOn={comment.id}
                owner={{
                  id: authorAddress,
                  displayName,
                  avatar: resolveSrc(authorAddress, 'profile'),
                }}
                root={String(comment.post?.id ?? '')}
                onSuccess={() => {
                  setShowReplyForm(false);
                  onReplyCreated();
                }}
              />
            </Box>
          )}

          {repliesOpen && showReplies && (
            <Box sx={{ pl: 2, mt: 1 }}>
              <RepliesList parentCommentId={comment.id} onReplyCreated={onReplyCreated} />
            </Box>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PublicationCommentItem;
