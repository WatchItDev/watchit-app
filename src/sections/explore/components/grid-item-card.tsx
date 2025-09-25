import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { Post } from '@src/graphql/generated/graphql';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication';

type Props = {
  post: Post;
  onActivate?: (post: Post, originEl?: HTMLElement) => void;
  isActive?: boolean;
};

export default function GridItemCard({ post, onActivate, isActive }: Props) {
  const router = useRouter();
  const title = post.title ?? '';
  const likes = post.likeCount ?? 0;
  const views = post.viewCount ?? 0;
  const creator = post?.author?.displayName ?? 'Unknown';
  const poster =
    getAttachmentCid(post as any, 'square') ||
    getAttachmentCid(post as any, 'poster');
  const image = getMediaUri(poster);

  const format = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  const goToDetails = () => router.push(paths.dashboard.publication.details(post.id));
  const handleActivate = (ev?: React.SyntheticEvent) => {
    if (onActivate) onActivate(post, (ev?.currentTarget as HTMLElement) ?? undefined);
    else goToDetails();
  };

  return (
    <Paper
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate(e);
        }
      }}
      role="button"
      aria-expanded={!!isActive}
      aria-label={title ? `Open ${title}` : 'Open item'}
      tabIndex={0}
      data-active={isActive ? 'true' : 'false'}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        cursor: 'pointer',
        height: '100%',
        outline: 'none',
        transition: 'box-shadow 160ms ease, transform 120ms ease',
        boxShadow: isActive
          ? '0 0 0 2px rgba(90,170,255,0.9), 0 10px 28px rgba(90,170,255,0.25)'
          : 'none',
        transform: isActive ? 'translateY(-1px)' : 'none',
        '&:focus-visible': { boxShadow: '0 0 0 2px rgba(255,255,255,0.25)' },
      }}
    >
      {/* Poster 1:1 */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Image alt={title} src={image} ratio="1/1" style={{ height: '100%', width: '100%' }} />
      </Box>

      {/* Overlays */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            p: 1,
            background: `linear-gradient(180deg, ${alpha('#000', 0.6)} 0%, ${alpha('#000', 0)} 80%)`,
            color: '#F2F3F5',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <icons.IconHeartFilled size={16} />
              <Typography variant="caption">{format(likes)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <icons.IconEye size={16} />
              <Typography variant="caption">{format(views)}</Typography>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1,
            background: `linear-gradient(0deg, ${alpha('#000', 0.7)} 0%, ${alpha('#000', 0)} 70%)`,
            color: '#F2F3F5',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {creator}
          </Typography>
        </Box>

        {/* "PLAYING" pill when active */}
        {isActive && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              px: 1,
              py: 0.25,
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 1,
              bgcolor: 'rgba(90,170,255,0.95)',
              color: '#0B1220',
              boxShadow: '0 6px 14px rgba(90,170,255,0.35)',
              pointerEvents: 'none',
            }}
          >
            PLAYING
          </Box>
        )}
      </Box>
    </Paper>
  );
}
