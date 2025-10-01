import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Fab,
  IconButton,
  Tooltip,
  useMediaQuery,
  Tabs,
  Tab,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { AnimatePresence, m } from 'framer-motion';
import {
  IconChevronLeft,
  IconChevronRight,
  IconThumbDown,
  IconHeart,
  IconFlame,
  IconStars,
  IconBookmark,
  IconShare3,
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

interface ExpanderPlayerInfoProps {
  post: Post;
  onPlayerControlsVisibilityChange?: (visible: boolean) => void;
}

export default function ExpanderPlayerInfo({ post, onPlayerControlsVisibilityChange }: ExpanderPlayerInfoProps) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [infoOpen, setInfoOpen] = useState(mdUp);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [playerH, setPlayerH] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'comments' | 'bakers' | 'sponsors'>('comments');
  const [reaction, setReaction] = useState<ReactionValue | null>(null);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [playerControlsVisible, setPlayerControlsVisible] = useState(true);
  const dispatch = useDispatch();
  const { session } = useAuth();
  const autoCloseTimerRef = useRef<number | null>(null);
  const reactionButtonRef = useRef<HTMLButtonElement | null>(null);
  const reactionMenuRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const h = e.contentRect.height;
        if (Number.isFinite(h)) setPlayerH(h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setInfoOpen(mdUp);
  }, [mdUp]);

  useEffect(() => () => {
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!infoOpen && autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, [infoOpen]);

  useEffect(() => {
    if (!infoOpen) {
      setReactionMenuOpen(false);
    }
  }, [infoOpen]);

  useEffect(() => {
    if (!reactionMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (reactionButtonRef.current?.contains(target)) return;
      if (reactionMenuRef.current?.contains(target)) return;
      setReactionMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setReactionMenuOpen(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactionMenuOpen]);

  const handleVideoPlay = () => {
    if (!infoOpen) return;
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
    }
    autoCloseTimerRef.current = window.setTimeout(() => {
      setInfoOpen(false);
      autoCloseTimerRef.current = null;
    }, INFO_AUTO_CLOSE_DELAY_MS);
  };

  const handleControlsVisibilityChange = (visible: boolean) => {
    setPlayerControlsVisible(visible);
    onPlayerControlsVisibilityChange?.(visible);
  };

  const MIN_H_XS = 280;
  const MIN_H_MD = 360;
  const overlayInset = mdUp ? 12 : 10;
  const overlayAvailableWidth = `calc(100% - ${overlayInset * 2}px)`;
  const panelFallbackHeight = mdUp ? INFO_PANEL_HEIGHT_DESKTOP : INFO_PANEL_HEIGHT_MOBILE;
  const panelHeight = playerH
    ? Math.min(
        Math.max(INFO_PANEL_MIN_HEIGHT, Math.round(playerH * INFO_PANEL_HEIGHT_RATIO)),
        Math.max(INFO_PANEL_MIN_HEIGHT, playerH - overlayInset),
      )
    : panelFallbackHeight;

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

  const currentReactionOption = reaction ? REACTIONS.find((option) => option.value === reaction) ?? null : null;
  const reactionHighlightColor = currentReactionOption?.color ?? '#fff';

  return (
    <Box sx={{ position: 'relative', marginBottom: '12px !important' }}>
      <ToggleLauncher
        show={!infoOpen && playerControlsVisible}
        onClick={() => setInfoOpen(true)}
        aria-label="Show content info"
        anchorOffset={overlayInset}
      />

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
              minHeight: { xs: MIN_H_XS, md: MIN_H_MD },
            }}
          >
            <PublicationPlayer
              publication={post}
              loading={false}
              onPlay={handleVideoPlay}
              onControlsVisibilityChange={handleControlsVisibilityChange}
            />
          </Box>

          <AnimatePresence initial={false}>
            {infoOpen && (
              <Box
                component={m.div}
                key="explore-info-panel"
                initial={{ x: '120%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '120%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                sx={{
                  position: 'absolute',
                  top: overlayInset,
                  right: overlayInset,
                  left: mdUp ? 'auto' : overlayInset,
                  width: mdUp ? INFO_PANEL_WIDTH_DESKTOP : overlayAvailableWidth,
                  maxWidth: overlayAvailableWidth,
                  zIndex: 5,
                  pointerEvents: 'auto',
                  willChange: 'transform, opacity',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    p: { xs: 2.25, md: 3 },
                    // background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(138,148,255,0.12) 35%, rgba(17,19,31,0.78) 100%)',
                    // bgcolor: 'rgba(14,16,25,0.72)',
                    border: '1px solid rgba(255,255,255,0.32)',
                    boxShadow: '0 36px 60px rgba(8,12,26,0.6)',
                    // backdropFilter: 'blur(32px) saturate(185%)',
                    // WebkitBackdropFilter: 'blur(32px) saturate(185%)',
                    backdropFilter: 'blur(10px)',
                    background: alpha('#0e1319', 0.92),
                    color: 'rgba(250,251,255,0.92)',
                    height: panelHeight - 25,
                    maxHeight: panelHeight - 25,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.25,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      pointerEvents: 'none',
                      background:
                        'linear-gradient(125deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 28%, rgba(255,255,255,0) 60%)',
                      opacity: 0.32,
                      mixBlendMode: 'screen',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      pointerEvents: 'none',
                      boxShadow:
                        '0 0 0 1px rgba(255,255,255,0.12) inset, 0 18px 28px rgba(12,16,38,0.55) inset, 0 1px 0 rgba(255,255,255,0.35)',
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setInfoOpen(false)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 10,
                      bgcolor: 'rgba(12,13,16,0.75)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'rgba(12,13,16,0.95)' },
                    }}
                    aria-label="Hide content info"
                  >
                    <IconChevronRight size={16} />
                  </IconButton>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <AvatarProfile
                      src={resolveSrc(post.author.profilePicture || post.author.address, 'profile')}
                      sx={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.24)' }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                        {post.author.displayName}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }} noWrap>
                        {post.title}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      maxWidth: { xs: '100%', md: '85%' },
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { xs: 3, md: 4 },
                      overflow: 'hidden',
                    }}
                  >
                    {post.description}
                  </Typography>

                  <Box sx={{ position: 'relative' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Tooltip title={`${formatNumber(post.likeCount)} bakers`} placement="top" arrow>
                        <Box
                          ref={reactionButtonRef}
                          component="button"
                          type="button"
                          onClick={handleReactionButtonClick}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 999,
                            border: `1px solid ${reaction ? alpha(reactionHighlightColor, 0.6) : 'rgba(255,255,255,0.12)'}`,
                            backgroundColor: reaction
                              ? alpha(reactionHighlightColor, 0.22)
                              : 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'background-color 160ms ease, border 160ms ease, transform 160ms ease',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            boxShadow: reaction
                              ? `0 12px 24px ${alpha(reactionHighlightColor, 0.16)}`
                              : 'none',
                            '&:hover': {
                              backgroundColor: reaction
                                ? alpha(reactionHighlightColor, 0.3)
                                : 'rgba(255,255,255,0.14)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <IconHeart size={18} style={{ color: reactionHighlightColor }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                            {formatNumber(post.likeCount)}
                          </Typography>
                        </Box>
                      </Tooltip>

                      <Tooltip title={`${formatNumber(post.bookmarkCount)} saves`} placement="top" arrow>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            transition: 'background-color 160ms ease, transform 160ms ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.16)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <IconBookmark size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Share" placement="top" arrow>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            transition: 'background-color 160ms ease, transform 160ms ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.16)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <IconShare3 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <AnimatePresence>
                      {reactionMenuOpen && (
                        <Box
                          component={m.div}
                          ref={reactionMenuRef}
                          variants={reactionMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          sx={{
                            position: 'absolute',
                            left: -10,
                            bottom: 'calc(100% + 10px)',
                            display: 'flex',
                            gap: '10px',
                            borderRadius: 10,
                            py: 0.75,
                            px: 1,
                            background: 'rgba(12,16,28,0.96)',
                            border: '1px solid rgba(255,255,255,0.16)',
                            boxShadow: '0 18px 32px rgba(6,10,24,0.55)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            zIndex: 15,
                            padding: '10px',
                          }}
                        >
                          {REACTIONS.map((option) => (
                            <Tooltip title={`${option.label}${option.price ? ` - ${option.price} MMC` : ''}`} placement="top" arrow>
                              <Box
                                key={option.value}
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
                                    width: 38,
                                    height: 38,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor:
                                      reaction === option.value
                                        ? alpha(option.color, 0.26)
                                        : 'rgba(25,32,52,0.9)',
                                    border:
                                      reaction === option.value
                                        ? `2px solid ${option.color}`
                                        : '2px solid rgba(255,255,255,0.1)',
                                    boxShadow:
                                      reaction === option.value
                                        ? `0 0 0 5px ${alpha(option.color, 0.18)}`
                                        : '0 3px 12px rgba(4,6,18,0.45)',
                                    transition: 'background-color 160ms ease, border 160ms ease, box-shadow 160ms ease',
                                  }}
                                >
                                  <option.icon size={16} />
                                </Box>
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      )}
                    </AnimatePresence>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue: 'comments' | 'bakers' | 'sponsors') => setActiveTab(newValue)}
                    variant={mdUp ? 'fullWidth' : 'scrollable'}
                    scrollButtons={mdUp ? false : 'auto'}
                    allowScrollButtonsMobile
                    sx={{
                      minHeight: 0,
                      '& .MuiTabs-flexContainer': {
                        gap: mdUp ? 1 : 0.5,
                      },
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        minHeight: 0,
                        minWidth: 'fit-content',
                        flex: mdUp ? 1 : undefined,
                        marginRight: '0 !important',
                        py: 0.75,
                        px: 1.25,
                        borderRadius: 999,
                        color: 'rgba(255,255,255,0.72)',
                      },
                      '& .Mui-selected': {
                        color: '#fff !important',
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: 999,
                        backgroundColor: '#fff',
                      },
                    }}
                  >
                    <Tab value="comments" label={`Comments (${formatNumber(commentCount)})`} />
                    <Tab value="bakers" label={`Bakers (${formatNumber(post.likeCount)})`} />
                    <Tab value="sponsors" label="Sponsors" />
                  </Tabs>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 0 }} />

                  <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: { xs: 0.5, md: 1 } }}>
                    {activeTab === 'comments' && (
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

                    {activeTab === 'bakers' && (
                      <Box sx={{ py: 1 }}>
                        <PublicationSponsorsAndBackers postId={post.id} />
                      </Box>
                    )}

                    {activeTab === 'sponsors' && (
                      <Box sx={{ py: 1 }}>
                        <LeaveTipCard post={post} />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </AnimatePresence>

        </Box>
      </Box>
    </Box>
  );
}

interface ToggleLauncherProps {
  show: boolean;
  onClick: () => void;
  anchorOffset: number;
  ariaLabel?: string;
}

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

const launcherVariants = {
  hidden: { opacity: 0, x: 80, pointerEvents: 'none' as const },
  visible: { opacity: 1, x: 0, pointerEvents: 'auto' as const },
};

const ToggleLauncher = ({ show, onClick, anchorOffset, ariaLabel }: ToggleLauncherProps) => (
  <AnimatePresence>
    {show && (
      <Stack
        component={m.div}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={launcherVariants}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        sx={{
          position: 'absolute',
          top: '50%',
          right: `${anchorOffset}px`,
          transform: 'translateY(-50%)',
          zIndex: 6,
        }}
      >
        <Tooltip title="Show content info" placement="left">
          <Fab
            size="medium"
            onClick={onClick}
            aria-label={ariaLabel}
            sx={{
              bgcolor: 'rgba(22,24,32,0.85)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 18px 30px rgba(5,8,20,0.45)',
              '&:hover': {
                bgcolor: 'rgba(22,24,32,0.95)',
              },
            }}
          >
            <IconChevronLeft />
          </Fab>
        </Tooltip>
      </Stack>
    )}
  </AnimatePresence>
);

const INFO_PANEL_WIDTH_DESKTOP = 400;
const INFO_PANEL_HEIGHT_DESKTOP = 400;
const INFO_PANEL_HEIGHT_MOBILE = 320;
const INFO_PANEL_HEIGHT_RATIO = 0.9;
const INFO_PANEL_MIN_HEIGHT = 220;
const INFO_AUTO_CLOSE_DELAY_MS = 5000;

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
