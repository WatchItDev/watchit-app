import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { IconChevronDown } from '@tabler/icons-react';
import { SponsorTicker } from './sponsor-ticker';
import type { ExplorePost } from '@src/sections/explore/types';

interface InfoOverlayProps {
  post: ExplorePost;
  isInfoExpanded: boolean;
  onToggleInfo: () => void;
  onHoverChange: (hovered: boolean) => void;
  shouldShowOverlays: boolean;
}

/** Overlay containing the author information and description excerpt. */
export const InfoOverlay = ({
  post,
  isInfoExpanded,
  onToggleInfo,
  onHoverChange,
  shouldShowOverlays,
}: InfoOverlayProps) => {
  if (!shouldShowOverlays) return null;

  const descriptionBaseSx = {
    opacity: 1,
    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
  } as const;

  const collapsedDescriptionSx = {
    ...descriptionBaseSx,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as const;

  const expandedDescriptionSx = {
    ...descriptionBaseSx,
    whiteSpace: 'pre-wrap',
  } as const;

  return (
    <Box
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      sx={{
        position: 'absolute',
        bottom: '90px',
        left: 1,
        right: 'auto',
        maxWidth: { xs: '72%', md: '38%' },
        pointerEvents: 'auto',
        zIndex: 6,
      }}
    >
      <Stack
        spacing={1.25}
        sx={{
          color: '#fff',
          p: { xs: 1.5, md: 2 },
          borderRadius: '0 16px 16px 0',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 18px 38px rgba(0,0,0,0.35)',
          background: 'linear-gradient(135deg, rgba(5,8,16,0.7), rgba(5,8,16,0.42))',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: -0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 1,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
              fontSize: '0.7rem',
            }}
          >
            {post.author.displayName}
          </Typography>

          <Tooltip title={isInfoExpanded ? 'Hide info' : 'Show info'} placement="top" arrow>
            <IconButton
              size="small"
              onClick={onToggleInfo}
              aria-expanded={isInfoExpanded}
              aria-label={isInfoExpanded ? 'Hide info' : 'Show info'}
              sx={{
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.28)',
                backgroundColor: alpha('#000', 0.35),
                color: '#fff',
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms ease',
                '&:hover': {
                  backgroundColor: alpha('#000', 0.55),
                  borderColor: 'rgba(255,255,255,0.42)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Box component="span" sx={{ display: 'flex', transform: !isInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <IconChevronDown size={16} />
              </Box>
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="h5" sx={{ lineHeight: 1.1, fontWeight: 700, textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)' }}>
          {post.title}
        </Typography>

        <Box>
          <Typography variant="body2" sx={isInfoExpanded ? expandedDescriptionSx : collapsedDescriptionSx}>
            {post.description ?? ''}
          </Typography>
        </Box>

        <SponsorTicker expanded={isInfoExpanded} />
      </Stack>
    </Box>
  );
};
