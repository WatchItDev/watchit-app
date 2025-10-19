import { useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import AvatarProfile from '@src/components/avatar/avatar';
import PublicationCommentForm from './publication-details-comment-form';
import { timeAgo } from '@src/utils/comment';
import { openLoginModal } from '@redux/auth';
import { useDispatch } from 'react-redux';
import { useAuth } from '@src/hooks/use-auth';
import { resolveSrc } from '@src/utils/image';
import type { PublicationCommentItemProps } from '@src/sections/publication/types';
import { icons } from '@tabler/icons-react';

const {
  IconChevronRight,
  IconMoodSmile,
  IconThumbDown,
  IconHeart,
  IconFlame,
  IconStars,
  IconMessageCircle,
  IconChevronDown,
  IconChevronUp,
} = icons;

const NAME_MAX_LENGTH = 24;

const COMMENT_REACTIONS = [
  { value: 'hate', label: 'Dislike', icon: IconThumbDown, color: '#ef5350' },
  { value: 'love', label: 'Like', icon: IconHeart, color: '#f06292' },
  { value: 'super_like', label: 'Super Like', icon: IconFlame, color: '#ff9100' },
  { value: 'mega_fan', label: 'Mega Fan', icon: IconStars, color: '#ffd600' },
] as const;

type CommentReactionValue = (typeof COMMENT_REACTIONS)[number]['value'];

const truncateName = (value?: string | null, max = NAME_MAX_LENGTH) => {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

const formatName = (raw?: string | null) => {
  if (!raw) return 'Watchit user';
  const trimmed = raw.trim();
  if (!trimmed) return 'Watchit user';
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  const second = parts[1]?.charAt(0) ?? '';
  const initial = second ? `${second.toUpperCase()}.` : '';
  return `${first}${initial ? ` ${initial}` : ''}`;
};

const PublicationCommentItem = ({
  comment,
  depth,
  replyingToName,
  replies = [],
  onReplyCreated,
  showReplies = true,
}: PublicationCommentItemProps) => {
  const dispatch = useDispatch();
  const { session } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const repliesList = replies;
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<CommentReactionValue | null>(null);
  const reactionButtonRef = useRef<HTMLButtonElement | null>(null);

  const author = comment.base?.user ?? null;
  const createdAt = comment.base?.createdAt ? new Date(comment.base.createdAt) : null;

  const displayName = useMemo(
    () => author?.displayName ?? author?.profile?.username ?? 'Watchit user',
    [author?.displayName, author?.profile?.username]
  );
  const formattedName = useMemo(() => formatName(displayName), [displayName]);
  const avatarSrc = author?.profilePicture ?? author?.profile?.picture ?? '';
  const rawAvatarSource = avatarSrc || author?.address || displayName || String(comment.id);
  const truncatedName = truncateName(formattedName);
  const formattedTargetName = useMemo(() => {
    if (!replyingToName) return null;
    return formatName(replyingToName);
  }, [replyingToName]);
  const truncatedTargetName = formattedTargetName ? truncateName(formattedTargetName) : null;
  const commentOwnerAvatar = resolveSrc(rawAvatarSource, 'profile');
  const isReply = depth === 1;
  const threadLevel = isReply ? 1 : 0;
  const repliesCount = repliesList.length;
  const showRepliesToggle = depth === 0 && showReplies && repliesCount > 0;
  const selectedReactionOption = selectedReaction
    ? COMMENT_REACTIONS.find((option) => option.value === selectedReaction) ?? null
    : null;
  const reactionHighlightColor = selectedReactionOption?.color ?? '#F5F6F8';
  const ReactionIcon = selectedReactionOption?.icon ?? null;
  const replyPaddingMultiplier = isReply ? 5 : 0; // extra width for reply input

  const handleReplyClick = () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setShowReplyForm((prev) => !prev);
  };

  const handleReactionButtonClick = () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setReactionMenuOpen((prev) => !prev);
  };

  const handleReactionSelect = (value: CommentReactionValue) => {
    setSelectedReaction((prev) => (prev === value ? null : value));
    setReactionMenuOpen(false);
  };

  const handleReactionMenuClose = () => setReactionMenuOpen(false);

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        position: 'relative',
        py: theme.spacing(threadLevel ? 0.75 : 1.1),
        maxWidth: '100%',
        backgroundColor: 'transparent',
        ...(threadLevel
          ? {
              ml: theme.spacing(0.6),
              pl: theme.spacing(1.35),
              '&::before': {
                content: '""',
                position: 'absolute',
                left: theme.spacing(0.15),
                top: theme.spacing(1.4),
                bottom: theme.spacing(-0.4),
                width: 1,
                borderRadius: 999,
                background: `linear-gradient(180deg, ${alpha('#FFFFFF', 0.32)} 0%, ${alpha('#FFFFFF', 0.1)} 100%)`,
              },
            }
          : {}),
      })}
    >
      <Stack
        direction="row"
        spacing={1.25}
        alignItems="flex-start"
        sx={{ width: '100%', backgroundColor: 'transparent' }}
      >
        <AvatarProfile
          src={commentOwnerAvatar}
          alt={displayName}
          sx={{ width: threadLevel ? 36 : 40, height: threadLevel ? 36 : 40, flexShrink: 0 }}
        />
        <Stack
          spacing={0.75}
          flex={1}
          minWidth={0}
          sx={{ backgroundColor: 'transparent', borderRadius: 0, boxShadow: 'none' }}
        >
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            sx={{ gap: 1, flexWrap: 'wrap', maxWidth: '100%', backgroundColor: 'transparent' }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                title={displayName}
                sx={{ fontWeight: 600, color: '#F5F6F8', lineHeight: 1.1, flexShrink: 0 }}
              >
                {truncatedName}
              </Typography>
              {truncatedTargetName && (
                <Stack
                  direction="row"
                  spacing={0.25}
                  alignItems="center"
                  sx={{ color: alpha('#FFFFFF', 0.6), fontSize: 13 }}
                >
                  <IconChevronRight size={12} strokeWidth={2.2} />
                  <Typography variant="subtitle2" title={replyingToName ?? undefined} sx={{ color: 'inherit', fontWeight: 500 }}>
                    {truncatedTargetName}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {createdAt && (
              <Typography
                variant="caption"
                sx={{ color: alpha('#FFFFFF', 0.45), whiteSpace: 'nowrap', fontSize: 12 }}
              >
                {timeAgo(createdAt)}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: alpha('#FFFFFF', 0.9),
              lineHeight: 1.45,
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {comment.body}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              pt: 0.25,
              gap: 0.75,
              flexWrap: 'wrap',
              pl: threadLevel ? 0.3 : 0,
            }}
          >
            <Tooltip title="Reply" placement="top">
              <IconButton
                size="small"
                onClick={handleReplyClick}
                sx={{ color: alpha('#FFFFFF', 0.75), p: 0.5 }}
              >
                <IconMessageCircle size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={selectedReactionOption ? selectedReactionOption.label : 'React'}
              placement="top"
              open={reactionMenuOpen ? false : undefined}
              disableFocusListener={reactionMenuOpen}
              disableHoverListener={reactionMenuOpen}
              disableTouchListener={reactionMenuOpen}
            >
              <IconButton
                size="small"
                ref={reactionButtonRef}
                onClick={handleReactionButtonClick}
                sx={{
                  color:
                    reactionMenuOpen || selectedReaction
                      ? reactionHighlightColor
                      : alpha('#FFFFFF', 0.75),
                  p: 0.5,
                }}
            >
                {ReactionIcon ? <ReactionIcon size={18} /> : <IconMoodSmile size={18} />}
              </IconButton>
            </Tooltip>

            {showRepliesToggle && (
              <Button
                size="small"
                onClick={() => setRepliesOpen((prev) => !prev)}
                endIcon={repliesOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                sx={{
                  color: alpha('#FFFFFF', 0.65),
                  textTransform: 'none',
                  px: 0.5,
                  minWidth: 0,
                  fontSize: 13,
                  '& .MuiButton-endIcon': {
                    ml: 0.5,
                    '& svg': { margin: 0 },
                  },
                }}
              >
                {repliesOpen ? 'Hide replies' : `Show replies (${repliesCount})`}
              </Button>
            )}
          </Stack>

          {showReplyForm && (
            <Box
              sx={(theme) => ({
                mt: 1,
                ...(isReply
                  ? {
                      ml: theme.spacing(-1.75),
                      width: `calc(100% + ${theme.spacing(replyPaddingMultiplier)})`,
                      maxWidth: `calc(100% + ${theme.spacing(replyPaddingMultiplier)})`,
                    }
                  : {}),
              })}
            >
              <PublicationCommentForm
                commentOn={comment.id}
                owner={{
                  id: author?.address ?? '',
                  displayName,
                  avatar: commentOwnerAvatar,
                }}
                root={String(comment.post?.id ?? '')}
                onSuccess={() => {
                  setShowReplyForm(false);
                  onReplyCreated();
                }}
              />
            </Box>
          )}

          {showRepliesToggle && repliesOpen && (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {repliesList.map(({ comment: reply, replyingToName: replyTarget }) => (
                <PublicationCommentItem
                  key={reply.id}
                  comment={reply}
                  depth={1}
                  replyingToName={replyTarget}
                  onReplyCreated={onReplyCreated}
                  showReplies={false}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Popper
        open={reactionMenuOpen && Boolean(reactionButtonRef.current)}
        anchorEl={reactionButtonRef.current}
        placement="top-start"
        transition
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'bottom left' }}>
            <Paper
              elevation={4}
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 2,
                display: 'flex',
                gap: 0.75,
                alignItems: 'center',
                backgroundColor: 'rgba(17, 18, 22, 0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <ClickAwayListener onClickAway={handleReactionMenuClose}>
                <Stack direction="row" spacing={0.5}>
                  {COMMENT_REACTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = selectedReaction === option.value;
                    return (
                      <Tooltip key={option.value} title={option.label} placement="top">
                        <IconButton
                          size="small"
                          onClick={() => handleReactionSelect(option.value)}
                          sx={{
                            color: option.color,
                            p: 0.5,
                            backgroundColor: active ? alpha(option.color, 0.22) : 'transparent',
                            borderRadius: 1.5,
                            transition: 'transform 0.16s ease, background-color 0.16s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              backgroundColor: alpha(option.color, 0.18),
                            },
                          }}
                        >
                          <Icon size={18} />
                        </IconButton>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default PublicationCommentItem;
