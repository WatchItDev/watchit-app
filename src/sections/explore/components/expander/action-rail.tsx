import type { MutableRefObject } from 'react';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import AvatarProfile from '@src/components/avatar/avatar';
import { alpha } from '@mui/material/styles';
import { IconMessageCircle, IconBookmark, IconShare3, IconUserPlus } from '@tabler/icons-react';
import { ActionButton } from './action-button';
import { ReactionMenu } from './reaction-menu';
import type { ReactionValue, SidePanelKey, ExplorePost } from '@src/sections/explore/types';
import { formatNumber, REACTIONS } from '@src/sections/explore/CONSTANTS';
import { resolveSrc } from '@src/utils/image';

interface ActionRailProps {
  post: ExplorePost;
  reaction: ReactionValue | null;
  reactionMenuOpen: boolean;
  onReactionButtonClick: () => void;
  onReactionChange: (value: ReactionValue) => void;
  reactionButtonRef: MutableRefObject<HTMLButtonElement | null>;
  reactionMenuRef: MutableRefObject<HTMLDivElement | null>;
  reactionHighlightColor: string;
  ReactionIconComponent: (props: { size?: number; color?: string }) => JSX.Element;
  openPanel: SidePanelKey | null;
  togglePanel: (panel: SidePanelKey) => void;
  commentCount: number;
  shareCount: number;
  bookmarkCount: number;
  handleGoToProfile: () => void;
  handleToggleFollow: () => void;
  isFollowing: boolean;
  followDisabled: boolean;
}

/** Vertical action bar rendered at the right of the expander. */
export const ActionRail = ({
  post,
  reaction,
  reactionMenuOpen,
  onReactionButtonClick,
  onReactionChange,
  reactionButtonRef,
  reactionMenuRef,
  reactionHighlightColor,
  ReactionIconComponent,
  openPanel,
  togglePanel,
  commentCount,
  shareCount,
  bookmarkCount,
  handleGoToProfile,
  handleToggleFollow,
  isFollowing,
  followDisabled,
}: ActionRailProps) => {
  const authorDisplayName = post.author.displayName ?? post.author.username ?? 'creator';

  return (
    <Stack spacing={1} sx={{ position: 'absolute', right: 24, bottom: '90px', alignItems: 'center', zIndex: 6 }}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ActionButton
          icon={
            <AvatarProfile
              src={resolveSrc(post.author.profilePicture || post.author.address || '', 'profile')}
              sx={{ width: 42, height: 42, border: '2px solid rgba(6, 3, 3, 0.4)' }}
            />
          }
          onClick={handleGoToProfile}
          tooltip={`View ${authorDisplayName}'s profile`}
          iconWrapperSx={{ backgroundColor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', p: 0 }}
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
                transition: 'transform 160ms ease, boxShadow 160ms ease',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 12px 20px rgba(0,0,0,0.55)' },
              }}
            >
              <IconUserPlus size={18} />
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ position: 'relative', marginTop: !isFollowing && !followDisabled ? '20px' : 0 }}>
        <ActionButton
          ref={reactionButtonRef}
          icon={<ReactionIconComponent size={22} color={reaction ? reactionHighlightColor : '#fff'} />}
          tooltip={reactionMenuOpen ? '' : 'Send a reaction'}
          onClick={onReactionButtonClick}
          active={Boolean(reaction)}
          iconWrapperSx={{
            backgroundColor: reaction ? alpha(reactionHighlightColor, 0.22) : 'rgba(0,0,0,0.5)',
            border: reaction ? `1px solid ${alpha(reactionHighlightColor, 0.6)}` : '1px solid rgba(255,255,255,0.2)',
            boxShadow: reaction ? `0 12px 24px ${alpha(reactionHighlightColor, 0.16)}` : 'none',
          }}
          label={formatNumber(post.likeCount)}
        />

        {reactionMenuOpen && (
          <ReactionMenu
            options={REACTIONS}
            activeReaction={reaction}
            menuRef={reactionMenuRef}
            onSelect={onReactionChange}
          />
        )}
      </Box>

      <ActionButton icon={<IconMessageCircle size={22} />} tooltip="Show comments" onClick={() => togglePanel('comments')} active={openPanel === 'comments'} label={formatNumber(commentCount)} />
      <ActionButton icon={<IconBookmark size={22} />} tooltip="Save" label={formatNumber(bookmarkCount)} />
      <ActionButton icon={<IconShare3 size={22} />} tooltip="Share" label={formatNumber(shareCount)} />
    </Stack>
  );
};
