import type { ReactNode } from 'react';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Divider, IconButton, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { alpha, useTheme } from '@mui/material/styles';
import { AnimatePresence, m } from 'framer-motion';
import {
  IconThumbDown,
  IconHeart,
  IconFlame,
  IconStars,
  IconBookmark,
  IconShare3,
  IconMessageCircle,
  IconUserPlus,
  IconUserCheck,
  IconUsersGroup,
  IconCoin,
  IconX,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import PublicationPlayer from '@src/sections/publication/components/publication-player';
import PostCommentList from '@src/sections/publication/components/publication-comments-list.tsx';
import PublicationCommentForm from '@src/sections/publication/components/publication-details-comment-form.tsx';
import AvatarProfile from '@src/components/avatar/avatar.tsx';
import { LeaveTipCard } from '@src/components/leave-tip-card.tsx';
import { PublicationSponsorsAndBackers } from '@src/sections/publication/components/publication-sponsors-and-bakers.tsx';
import type { Post } from '@src/graphql/generated/graphql';
import { useAuth } from '@src/hooks/use-auth.ts';
import { openLoginModal } from '@redux/auth';
import { resolveSrc } from '@src/utils/image.ts';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import {
  useGetIsFollowingLazyQuery,
  useToggleFollowMutation,
} from '@src/graphql/generated/hooks.tsx';
import GlassPanel from './glass-panel';

interface ExpanderPlayerInfoProps {
  post: Post;
  onPlayerControlsVisibilityChange?: (visible: boolean) => void;
}

type SidePanelKey = 'comments' | 'bakers' | 'sponsors';

export default function ExpanderPlayerInfo({ post, onPlayerControlsVisibilityChange }: ExpanderPlayerInfoProps) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [playerHeight, setPlayerHeight] = useState<number>(0);
  const [openPanel, setOpenPanel] = useState<SidePanelKey | null>(null);
  const [reaction, setReaction] = useState<ReactionValue | null>(null);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [playerControlsVisible, setPlayerControlsVisible] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFetchingFollow, setIsFetchingFollow] = useState(true);
  const [overlayHovered, setOverlayHovered] = useState(false);

  const dispatch = useDispatch();
  const { session } = useAuth();
  const router = useRouter();

  const playerRef = useRef<HTMLDivElement | null>(null);
  const reactionButtonRef = useRef<HTMLButtonElement | null>(null);
  const reactionMenuRef = useRef<HTMLDivElement | null>(null);

  const [getIsFollowing] = useGetIsFollowingLazyQuery();
  const [toggleFollow, { loading: toggleFollowLoading }] = useToggleFollowMutation();
  const authorDisplayName = post.author.displayName ?? post.author.username ?? 'creator';

  useLayoutEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextHeight = entry.contentRect.height;
        if (Number.isFinite(nextHeight)) setPlayerHeight(Math.round(nextHeight));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!post.author.address) return;
    let mounted = true;
    setIsFetchingFollow(true);
    getIsFollowing({ variables: { targetAddress: post.author.address } })
      .then((res) => {
        if (!mounted) return;
        const status = res.data?.getIsFollowing ?? false;
        setIsFollowing(status);
        setIsFetchingFollow(false);
      })
      .catch((error) => {
        console.error('getIsFollowing error', error);
        if (!mounted) return;
        setIsFollowing(false);
        setIsFetchingFollow(false);
      });
    return () => {
      mounted = false;
    };
  }, [getIsFollowing, post.author.address]);

  useEffect(() => {
    setCommentCount(post.commentCount);
  }, [post.commentCount]);

  useEffect(() => {
    if (!reactionMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (reactionButtonRef.current?.contains(target)) return;
      if (reactionMenuRef.current?.contains(target)) return;
      setReactionMenuOpen(false);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReactionMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactionMenuOpen]);

  const shouldShowOverlays = playerControlsVisible || openPanel !== null || overlayHovered;
  const shouldShowActions = shouldShowOverlays && openPanel === null;

  useEffect(() => {
    if (!shouldShowActions && reactionMenuOpen) {
      setReactionMenuOpen(false);
    }
  }, [shouldShowActions, reactionMenuOpen]);

  const overlayInset = mdUp ? 24 : 16;
  const panelFallbackHeight = mdUp ? INFO_PANEL_HEIGHT_DESKTOP : INFO_PANEL_HEIGHT_MOBILE;
  const panelHeight = playerHeight
    ? Math.min(
        Math.max(INFO_PANEL_MIN_HEIGHT, Math.round(playerHeight * INFO_PANEL_HEIGHT_RATIO)),
        Math.max(INFO_PANEL_MIN_HEIGHT, playerHeight - overlayInset * 2),
      )
    : panelFallbackHeight;

  const currentReactionOption = reaction ? REACTIONS.find((option) => option.value === reaction) ?? null : null;
  const reactionHighlightColor = currentReactionOption?.color ?? '#fff';
  const ReactionIconComponent = currentReactionOption?.icon ?? IconHeart;

  const handleControlsVisibilityChange = (visible: boolean) => {
    setPlayerControlsVisible(visible);
    onPlayerControlsVisibilityChange?.(visible);
  };

  const handleReactionButtonClick = () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setReactionMenuOpen((prev) => !prev);
  };

  const handleReactionChange = (value: ReactionValue) => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    setReaction((prev) => (prev === value ? null : value));
    setReactionMenuOpen(false);
  };

  const handleCommentCreated = (shouldIncrement = true) => {
    if (!shouldIncrement) return;
    setCommentCount((prev) => prev + 1);
  };

  const handleTogglePanel = (panel: SidePanelKey) => {
    setReactionMenuOpen(false);
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const closePanel = () => setOpenPanel(null);

  const handleGoToProfile = () => {
    if (!post.author.address) return;
    router.push(paths.dashboard.user.root(`${post.author.address}`));
  };

  const handleToggleFollow = async () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    if (!post.author.address) return;

    try {
      const result = await toggleFollow({ variables: { input: { targetAddress: post.author.address } } });
      const nextState = result.data?.toggleFollow ?? false;
      setIsFollowing(nextState);
    } catch (error) {
      console.error('toggleFollow error', error);
    }
  };

  const followDisabled =
    isFetchingFollow || toggleFollowLoading || post.author.address === session?.user?.address;

  const panelTitle = openPanel
    ? {
        comments: `Comments (${formatNumber(commentCount)})`,
        bakers: `Bakers (${formatNumber(post.likeCount)})`,
        sponsors: 'Sponsors',
      }[openPanel]
    : '';

  return (
    <Box sx={{ position: 'relative', marginBottom: '12px !important' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            ref={playerRef}
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              minHeight: { xs: MIN_PLAYER_HEIGHT_XS, md: MIN_PLAYER_HEIGHT_MD },
            }}
          >
            <PublicationPlayer
              publication={post}
              loading={false}
              onControlsVisibilityChange={handleControlsVisibilityChange}
            />
          </Box>

          {shouldShowOverlays && (
            <>
              <Box
                onPointerEnter={() => setOverlayHovered(true)}
                onPointerLeave={() => setOverlayHovered(false)}
                sx={{
                  position: 'absolute',
                  bottom: '90px',
                  left: overlayInset,
                  right: overlayInset + 120,
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  color: '#fff',
                  maxWidth: { xs: '68%', md: '52%' },
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  background: 'linear-gradient(135deg, rgba(8,10,16,0.76), rgba(8,10,16,0.35))',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {post.author.displayName}
                </Typography>
                <Typography variant="h5" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.82,
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 3, md: 4 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </Typography>
              </Box>

              {shouldShowActions && (
                <Stack
                  onPointerEnter={() => setOverlayHovered(true)}
                  onPointerLeave={() => setOverlayHovered(false)}
                  spacing={1}
                  sx={{
                    position: 'absolute',
                    right: overlayInset,
                    bottom: '90px',
                    alignItems: 'center',
                    zIndex: 6,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <ActionButton
                      icon={
                        <AvatarProfile
                          src={resolveSrc(post.author.profilePicture || post.author.address, 'profile')}
                          sx={{ width: 42, height: 42, border: '2px solid rgba(255,255,255,0.4)' }}
                        />
                      }
                      onClick={handleGoToProfile}
                      tooltip={`View ${authorDisplayName}'s profile`}
                      iconWrapperSx={{
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        p: 0,
                      }}
                    />

                    {!isFollowing && !followDisabled && (
                      <Tooltip title={`Follow ${authorDisplayName}`} placement="top" arrow>
                        <Box
                          component="button"
                          type="button"
                          onClick={handleToggleFollow}
                          sx={{
                            position: 'absolute',
                            bottom: -18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            border: '2px solid rgba(12,13,16,0.85)',
                            backgroundColor: '#ff2d55',
                            color: '#fff',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.45)',
                            cursor: 'pointer',
                            transition: 'transform 160ms ease, box-shadow 160ms ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 12px 20px rgba(0,0,0,0.55)',
                            },
                          }}
                        >
                          <IconUserPlus size={18} />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ position: 'relative', marginTop: !isFollowing && !followDisabled ? '20px' : '0px' }}>
                    <ActionButton
                      ref={reactionButtonRef}
                      icon={<ReactionIconComponent size={22} color={reaction ? reactionHighlightColor : '#fff'} />}
                      tooltip={reactionMenuOpen ? '' : 'Send a reaction'}
                      onClick={handleReactionButtonClick}
                      active={Boolean(reaction)}
                      iconWrapperSx={{
                        backgroundColor: reaction
                          ? alpha(reactionHighlightColor, 0.22)
                          : 'rgba(0,0,0,0.55)',
                        border: `1px solid ${
                          reaction ? alpha(reactionHighlightColor, 0.6) : 'rgba(255,255,255,0.2)'
                        }`,
                        boxShadow: reaction
                          ? `0 12px 24px ${alpha(reactionHighlightColor, 0.16)}`
                          : 'none',
                      }}
                      label={formatNumber(post.likeCount)}
                    />

                    <AnimatePresence>
                      {reactionMenuOpen && shouldShowActions && (
                        <GlassPanel
                          component={m.div}
                          ref={reactionMenuRef}
                          sx={{
                            position: 'absolute',
                            right: 'calc(100% + 16px)',
                            top: '-7px',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            gap: 1.25,
                            p: 1.5,
                            borderRadius: 18,
                            alignItems: 'center',
                            zIndex: 10,
                            minWidth: 0,
                          }}
                        >
                          {REACTIONS.map((option) => (
                            <Tooltip
                              key={option.value}
                              title={`${option.label}${option.price ? ` - ${option.price} MMC` : ''}`}
                              placement="top"
                              arrow
                            >
                              <Box
                                component={m.button}
                                type="button"
                                onClick={() => handleReactionChange(option.value)}
                                variants={reactionItemVariants}
                                whileHover={{ y: -6, scale: 1.06 }}
                                whileTap={{ scale: 0.94 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                                sx={{
                                  border: 0,
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  color: '#fff',
                                  textAlign: 'center',
                                  padding: 0,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background:
                                      reaction === option.value
                                        ? alpha(option.color, 0.26)
                                        : 'linear-gradient(135deg, rgba(18,22,32,0.68), rgba(10,12,24,0.42))',
                                    border:
                                      reaction === option.value
                                        ? `2px solid ${option.color}`
                                        : '1px solid rgba(255,255,255,0.22)',
                                    boxShadow:
                                      reaction === option.value
                                        ? `0 0 0 5px ${alpha(option.color, 0.18)}`
                                        : '0 12px 22px rgba(4,8,18,0.45)',
                                    backdropFilter: reaction === option.value ? undefined : 'blur(18px)',
                                    WebkitBackdropFilter: reaction === option.value ? undefined : 'blur(18px)',
                                    transition:
                                      'background 160ms ease, border 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                                  }}
                                >
                                  <option.icon size={16} />
                                </Box>
                              </Box>
                            </Tooltip>
                          ))}
                        </GlassPanel>
                      )}
                    </AnimatePresence>
                  </Box>

                  <ActionButton
                    icon={<IconMessageCircle size={22} />}
                    tooltip="Show comments"
                    onClick={() => handleTogglePanel('comments')}
                    active={openPanel === 'comments'}
                    label={formatNumber(commentCount)}
                  />

                  <ActionButton
                    icon={<IconBookmark size={22} />}
                    tooltip="Save"
                    label={formatNumber(post.bookmarkCount)}
                  />

                  <ActionButton
                    icon={<IconShare3 size={22} />}
                    tooltip="Share"
                    label="Share"
                  />

                  {/* <ActionButton
                    icon={<IconCoin size={22} />}
                    tooltip="View sponsors"
                    onClick={() => handleTogglePanel('sponsors')}
                    active={openPanel === 'sponsors'}
                    label="Tips"
                  /> */}
                </Stack>
              )}

              <AnimatePresence initial={false}>
                {openPanel && (
                  <GlassPanel
                    component={m.div}
                    key={`side-panel-${openPanel}`}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: {
                        xs: `min(320px, calc(100% - ${overlayInset * 2}px))`,
                        md: INFO_PANEL_WIDTH_DESKTOP,
                      },
                      maxWidth: `calc(100% - ${overlayInset * 2}px)`,
                      height: 'auto',
                      maxHeight: 'calc(100% - 100px)',
                      zIndex: 8,
                      pointerEvents: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {panelTitle}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={closePanel}
                        sx={{
                          bgcolor: 'rgba(12,13,16,0.75)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.16)',
                          '&:hover': { bgcolor: 'rgba(12,13,16,0.95)' },
                        }}
                        aria-label="Close panel"
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Stack>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: { xs: 0.5, md: 1 } }}>
                      {openPanel === 'comments' && (
                        <Stack spacing={2} sx={{ py: 1 }}>
                          {session?.authenticated ? (
                            <PublicationCommentForm
                              root={post.id}
                              commentOn={null}
                              owner={{
                                id: post.author.address,
                                displayName: post.author.displayName ?? 'Watchit',
                                avatar: resolveSrc(post.author.profilePicture || post.author.address, 'profile'),
                              }}
                              onSuccess={() => handleCommentCreated(true)}
                            />
                          ) : (
                            <Box
                              sx={{
                                borderRadius: 2,
                                border: '1px dashed rgba(255,255,255,0.2)',
                                p: 2,
                                textAlign: 'center',
                                bgcolor: alpha('#121217', 0.5),
                              }}
                            >
                              <Typography variant="body2" sx={{ mb: 1, opacity: 0.72 }}>
                                Login to leave a comment
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <PostCommentList
                              publicationId={post.id}
                              showReplies
                              onReplyCreated={() => handleCommentCreated(false)}
                            />
                          </Box>
                        </Stack>
                      )}

                      {openPanel === 'bakers' && (
                        <Box sx={{ py: 1 }}>
                          <PublicationSponsorsAndBackers postId={post.id} />
                        </Box>
                      )}

                      {openPanel === 'sponsors' && (
                        <Box sx={{ py: 1 }}>
                          <LeaveTipCard post={post} />
                        </Box>
                      )}
                    </Box>
                  </GlassPanel>
                )}
              </AnimatePresence>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode;
  label?: ReactNode;
  tooltip?: string;
  active?: boolean;
  iconWrapperSx?: SxProps<Theme>;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { icon, label, tooltip, active = false, iconWrapperSx, disabled, ...buttonProps },
    ref,
  ) => {
    const tooltipLabel = tooltip ?? '';
    return (
      <Stack spacing={0.5} alignItems="center" component="div">
        <Tooltip
          title={tooltipLabel}
          placement="left"
          arrow
          disableHoverListener={!tooltipLabel}
          disableFocusListener={!tooltipLabel}
          disableTouchListener={!tooltipLabel}
        >
          <span style={{ display: 'inline-flex' }}>
            <Box
              component="button"
              type="button"
              ref={ref}
              disabled={disabled}
              {...buttonProps}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.55)',
                border: active ? '1px solid rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: disabled ? 'default' : 'pointer',
                transition: 'transform 160ms ease, background-color 160ms ease, border-color 160ms ease',
                opacity: disabled ? 0.5 : 1,
                '&:hover': disabled
                  ? undefined
                  : {
                      transform: 'translateY(-2px)',
                    },
                ...iconWrapperSx,
              }}
            >
              {icon}
            </Box>
          </span>
        </Tooltip>
        {label ? (
          <Typography
            variant="caption"
            sx={{
              letterSpacing: 0.2,
              fontWeight: 700,
              maxWidth: 80,
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              lineHeight: '16px',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            {label}
          </Typography>
        ) : null}
      </Stack>
    );
  },
);

ActionButton.displayName = 'ActionButton';

const sidePanelVariants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 28 },
  },
  exit: { opacity: 0, x: 48, transition: { duration: 0.18 } },
};

const reactionMenuVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.18 } },
};

const reactionItemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const INFO_PANEL_WIDTH_DESKTOP = 360;
const INFO_PANEL_HEIGHT_DESKTOP = 400;
const INFO_PANEL_HEIGHT_MOBILE = 320;
const INFO_PANEL_HEIGHT_RATIO = 0.9;
const INFO_PANEL_MIN_HEIGHT = 220;
const MIN_PLAYER_HEIGHT_XS = 280;
const MIN_PLAYER_HEIGHT_MD = 360;

const REACTIONS = [
  { value: 'hate', label: 'Dislike', icon: IconThumbDown, color: '#ef5350', price: undefined },
  { value: 'love', label: 'Like', icon: IconHeart, color: '#f06292', price: undefined },
  { value: 'super_like', label: 'Super Like', icon: IconFlame, color: '#ff9100', price: 10 },
  { value: 'mega_fan', label: 'Mega Fan', icon: IconStars, color: '#ffd600', price: 50 },
] as const;

type ReactionValue = (typeof REACTIONS)[number]['value'];

function formatNumber(value?: number | null) {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}
