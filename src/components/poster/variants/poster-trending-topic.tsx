// @mui
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import Image from '@src/components/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import { TrendingTopicsType } from '@src/sections/explore/view.tsx';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const PosterTrendingTopic = ({ id, title, image, desc }: TrendingTopicsType) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(String(id)));
  };

  return (
    <Paper
      sx={{
        marginBottom: 4,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
      onClick={handlePosterClick}
    >
      <Stack direction="row" spacing={0}>
        <StackItem>
          {/* Poster image */}
          <Box
            sx={{
              width: '150px',
            }}
          >
            <Image style={{ borderRadius: '10px' }} alt={title} src={image} ratio="1/1" />
          </Box>
        </StackItem>
        <StackItem>
          <Typography
            style={{
              fontSize: 'clamp(0.5rem, 1vw, 2rem)',
              textOverflow: 'clip',
              wordWrap: 'break-word',
            }}
            noWrap
            variant="h6"
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>
          {/* Details: Desc */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '700' }}
              variant="body2"
              color="textSecondary"
            >
              {desc}
            </Typography>
          </Stack>
        </StackItem>
      </Stack>
    </Paper>
  );
};

export default PosterTrendingTopic;

export const StackItem = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1),
  borderRadius: 4,
  ...theme.applyStyles('dark', {
    backgroundColor: '#262B32',
  }),
}));
