import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PublicationPlayer from '@src/sections/publication/components/publication-player';
import { useAuth } from '@src/hooks/use-auth';
import { useDispatch } from 'react-redux';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { ActionRail } from './action-rail';
import { InfoOverlay } from './info-overlay';
import { SidePanel } from './side-panel';
import { useFollowEdgeStatus } from '@src/hooks/use-follow-edge-status';
import { useReactionMenu } from '@src/hooks/use-reaction-menu';
import { useExpanderPanels } from '@src/hooks/use-expander-panels';
import { usePlayerOverlay } from '@src/hooks/use-player-overlay';
import { REACTIONS, MIN_PLAYER_HEIGHT_MD, MIN_PLAYER_HEIGHT_XS } from '@src/sections/explore/CONSTANTS';
import type { ExpanderPlayerInfoProps, ExplorePost, SidePanelKey } from '@src/sections/explore/types';

/** Main explore expander player that orchestrates overlays and actions. */
export const ExpanderPlayerInfo = ({ post: rawPost, onPlayerControlsVisibilityChange }: ExpanderPlayerInfoProps) => {
  if (!rawPost) {
    console.warn('ExpanderPlayerInfo: tried to render without a post');
    return null;
  }
  const post = rawPost as ExplorePost;
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const shareCount = post.shareCount ?? 0;

  const { session } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    playerRef,
    playerControlsVisible,
    isInfoExpanded,
    overlayHovered,
    setOverlayHovered,
    handleControlsVisibilityChange,
    handleToggleInfo,
  } = usePlayerOverlay({ postId: post.id, onVisibilityChange: onPlayerControlsVisibilityChange });

  const { isFollowing, isFetching, toggleFollow, followDisabled, loading } = useFollowEdgeStatus({
    authorId: post.author.id,
    authorAddress: post.author.address,
    session: session?.session ?? null,
    dispatch,
  });

  const reactionButtonRef = useRef<HTMLButtonElement | null>(null);
  const reactionMenuRef = useRef<HTMLDivElement | null>(null);

  const {
    reaction,
    reactionMenuOpen,
    setReactionMenuOpen,
    handleReactionButtonClick,
    handleReactionChange,
  } = useReactionMenu({
    session: session?.session ?? null,
    dispatch,
    buttonRef: reactionButtonRef,
    menuRef: reactionMenuRef,
  });

  const { openPanel, togglePanel, closePanel, commentCount, handleCommentCreated } = useExpanderPanels({
    initialCommentCount: post.commentCount ?? 0,
  });

  const shouldShowOverlays = playerControlsVisible || openPanel !== null || overlayHovered;
  const shouldShowActions = shouldShowOverlays && openPanel === null;

  useEffect(() => {
    if (!shouldShowActions && reactionMenuOpen) setReactionMenuOpen(false);
  }, [shouldShowActions, reactionMenuOpen, setReactionMenuOpen]);

  const currentReactionOption = reaction ? REACTIONS.find((option) => option.value === reaction) ?? null : null;
  const reactionHighlightColor = currentReactionOption?.color ?? '#fff';
  const ReactionIconComponent = currentReactionOption?.icon ?? REACTIONS[1].icon;

  const handleGoToProfile = () => {
    if (!post.author.address) return;
    router.push(paths.dashboard.user.root(`${post.author.address}`));
  };

  const handlePanelToggle = (panel: SidePanelKey) => {
    setReactionMenuOpen(false);
    togglePanel(panel);
  };

  return (
    <Box sx={{ position: 'relative', marginBottom: '12px !important' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 2, alignItems: 'start' }}>
        <Box sx={{ position: 'relative' }}>
          <Box ref={playerRef} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', aspectRatio: '16 / 9', minHeight: { xs: MIN_PLAYER_HEIGHT_XS, md: MIN_PLAYER_HEIGHT_MD } }}>
            <PublicationPlayer
              publication={post}
              loading={false}
              onControlsVisibilityChange={handleControlsVisibilityChange}
              playerContainerRef={playerRef}
            />
          </Box>

          <InfoOverlay post={post} isInfoExpanded={isInfoExpanded} onToggleInfo={handleToggleInfo} onHoverChange={setOverlayHovered} shouldShowOverlays={shouldShowOverlays} />

          {shouldShowActions && (
            <ActionRail
              post={post}
              reaction={reaction}
              reactionMenuOpen={reactionMenuOpen}
              onReactionButtonClick={handleReactionButtonClick}
              onReactionChange={handleReactionChange}
              reactionButtonRef={reactionButtonRef}
              reactionMenuRef={reactionMenuRef}
              reactionHighlightColor={reactionHighlightColor}
              ReactionIconComponent={ReactionIconComponent}
              openPanel={openPanel}
              togglePanel={handlePanelToggle}
              commentCount={commentCount}
              shareCount={shareCount}
              bookmarkCount={post.bookmarkCount ?? 0}
              handleGoToProfile={handleGoToProfile}
              handleToggleFollow={toggleFollow}
              isFollowing={isFollowing}
              followDisabled={followDisabled || loading || isFetching}
            />
          )}

          <SidePanel openPanel={openPanel} closePanel={() => { closePanel(); setReactionMenuOpen(false); }} post={post} commentCount={commentCount} session={session?.session ?? null} onCommentCreated={handleCommentCreated} />
        </Box>
      </Box>
    </Box>
  );
};

export default ExpanderPlayerInfo;
