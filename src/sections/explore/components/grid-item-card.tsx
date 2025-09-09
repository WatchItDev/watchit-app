import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { icons } from '@tabler/icons-react';

import Image from '@src/components/image';
import TextMaxLine from '@src/components/text-max-line';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { Post } from '@src/graphql/generated/graphql';
import { getAttachmentCid, getMediaUri } from '@src/utils/publication';

export default function GridItemCard({ post }: { post: Post }) {
  const router = useRouter();
  const title = post.title ?? '';
  const likes = (post as any).likeCount ?? 0;
  const views = (post as any).viewCount ?? 0;
  const creator = (post as any)?.author?.displayName ?? (post as any)?.owner?.displayName ?? 'Unknown';

  const poster = getAttachmentCid(post as any, 'square') || getAttachmentCid(post as any, 'poster');
  const image = getMediaUri(poster);

  const format = (n: number) => (n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : `${n}`);
  const onOpen = () => router.push(paths.dashboard.publication.details(post.id));

  return (
    <Paper onClick={onOpen} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, cursor: 'pointer', height: '100%' }}>
      {/* Imagen 1:1 */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Image alt={title} src={image} ratio="1/1" style={{ height: '100%', width: '100%' }} />
      </Box>

      {/* Overlays */}
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
        {/* Top: stats */}
        <Box sx={{ p: 1, background: `linear-gradient(180deg, ${alpha('#000', 0.6)} 0%, ${alpha('#000', 0)} 80%)`, color: '#F2F3F5' }}>
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

        {/* Bottom: creator + title */}
        <Box sx={{ p: 1, background: `linear-gradient(0deg, ${alpha('#000', 0.7)} 0%, ${alpha('#000', 0)} 70%)`, color: '#F2F3F5' }}>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>{creator}</Typography>
          <TextMaxLine line={2} variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</TextMaxLine>
        </Box>
      </Box>
    </Paper>
  );
}
