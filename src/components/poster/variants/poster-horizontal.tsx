// @mui
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import { bgGradient } from '@src/theme/css';
import Image from '@src/components/image';
import { icons } from '@tabler/icons-react';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import TextMaxLine from '@src/components/text-max-line';
import { Poster } from '../types';

// ----------------------------------------------------------------------

const PosterHorizontal = ({ title, images, likes, id, synopsis }: Poster) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(id));
  };

  const formatLikes = (totalLikes: number) => {
    if (totalLikes >= 1000000) {
      return `${(totalLikes / 1000000).toFixed(1)}M`;
    }
    if (totalLikes >= 1000) {
      return `${(totalLikes / 1000).toFixed(1)}K`;
    }
    return totalLikes;
  };

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
      onClick={handlePosterClick}
    >
      {/* Poster image */}
      <Image
        style={{ borderRadius: '10px' }}
        alt={title}
        src={images.vertical}
        ratio="1/1"
      />

      {/* Upper side: Likes & prices */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          /* justifyContent: 'space-between',
          alignItems:'center', */
          color: 'common.white',
          zIndex: 9,
          ...bgGradient({
            direction: 'to bottom',
            startColor: alpha('#000', 0.8),
            endColor: alpha('#000', 0),
          }),
        }}
      >
        {/* Likes */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            textAlign="center"
          >
            <icons.IconHeartFilled
              style={{ marginBottom: '2px' }}
              size={16}
              color="#F2F3F5"
            />
            <TextMaxLine line={1} variant="body2">
              {formatLikes(likes ?? 0)}
            </TextMaxLine>
          </Stack>
        </Box>
      </Box>

      {/* Downside: Title & details */}
      <CardContent
        sx={{
          width: '100%',
          padding: '0px 8px 0px 8px !important',
          textAlign: 'left',
          color: 'common.white',
          marginTop: '10px',
        }}
      >
        {/* Title */}
        <TextMaxLine line={2} noWrap variant="h6" sx={{ mb: 1 }}>
          {title}
        </TextMaxLine>

        {/* Details: Rating, Year, Genre */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextMaxLine line={2} variant="body2" color="textSecondary">
            {synopsis}
          </TextMaxLine>
          <Typography
            sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '500' }}
            noWrap
            variant="body2"
          ></Typography>
        </Stack>
      </CardContent>
    </Paper>
  );
};

export default PosterHorizontal;
