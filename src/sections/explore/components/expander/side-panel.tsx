import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { IconX } from '@tabler/icons-react';
import GlassPanel from '../glass-panel';
import PublicationCommentForm from '@src/sections/publication/components/publication-details-comment-form.tsx';
import PostCommentList from '@src/sections/publication/components/publication-comments-list.tsx';
import { PublicationSponsorsAndBackers } from '@src/sections/publication/components/publication-sponsors-and-bakers.tsx';
import { LeaveTipCard } from '@src/components/leave-tip-card.tsx';
import type { SidePanelKey, ExplorePost } from '@src/sections/explore/types';
import type { ReduxSession } from '@redux/types';
import { formatNumber } from '@src/sections/explore/CONSTANTS';
import { resolveSrc } from '@src/utils/image';

interface SidePanelProps {
  openPanel: SidePanelKey | null;
  closePanel: () => void;
  post: ExplorePost;
  commentCount: number;
  session: ReduxSession | null;
  onCommentCreated: (shouldIncrement?: boolean) => void;
}

/** Right-hand panel that surfaces comments, backers or tipping options. */
export const SidePanel = ({ openPanel, closePanel, post, commentCount, session, onCommentCreated }: SidePanelProps) => {
  if (!openPanel) return null;

  const panelTitle = {
    comments: `Comments (${formatNumber(commentCount)})`,
    bakers: `Bakers (${formatNumber(post.likeCount)})`,
    sponsors: 'Sponsors',
  }[openPanel];

  return (
    <GlassPanel
      key={`side-panel-${openPanel}`}
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: { xs: `min(320px, calc(100% - 32px))`, md: 360 },
        maxWidth: 'calc(100% - 32px)',
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
                root={String(post.id)}
                commentOn={null}
                owner={{
                  id: post.author.address || '',
                  displayName: post.author.displayName ?? 'Watchit',
                  avatar: resolveSrc(post.author.profilePicture || post.author.address || '', 'profile'),
                }}
                onSuccess={() => onCommentCreated(true)}
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
                publicationId={String(post.id)}
                showReplies
                onReplyCreated={() => onCommentCreated(false)}
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
  );
};
