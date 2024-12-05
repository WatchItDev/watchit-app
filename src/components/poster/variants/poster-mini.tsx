// @mui
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import Image from '@src/components/image';
import { IconStarFilled } from '@tabler/icons-react';
import { Poster } from '../types';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';

// ----------------------------------------------------------------------

const PosterMini = ({ id, title, images, rating, year, price, genre }: Poster) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(id));
  };

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onClick={handlePosterClick}
    >
      <Box
        sx={{
          borderRadius: '10px',
          height: '100%',
          width: '50%',
          display: 'flex',
          flexGrow: 1,
          flexShrink: 0,
        }}
      >
        <Image style={{ borderRadius: '10px' }} alt={title} src={images.vertical} ratio="4/6" />
      </Box>

      {/* Upper side: Likes & prices */}
      <Box
        sx={{
          maxWidth: '50%',
          padding: 0,
          display: 'flex',
          color: 'common.white',
          marginLeft: '10px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'common.white',
            padding: 0,
          }}
        >
          {/* Downside: Title & details */}
          <CardContent
            sx={{
              width: '100%',
              padding: 0,
              textAlign: 'left',
            }}
          >
            {/* Title */}
            <Typography
              style={{ fontSize: 'clamp(0.5rem, 1vw, 1rem)' }}
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconStarFilled size={14} color="#FFCD19" />
                <Typography
                  sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 0.7rem)', fontWeight: '700' }}
                  variant="body2"
                >
                  {rating}
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 0.7rem)' }}
                variant="body2"
                color="textSecondary"
              >
                |
              </Typography>
              <Typography
                sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 0.7rem)', fontWeight: '700' }}
                variant="body2"
              >
                {year}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{ fontSize: 'clamp(0.1rem, 0.8vw, 0.7rem)', fontWeight: '700' }}
                variant="body2"
                color="textSecondary"
              >
                {genre.join(' - ')}
              </Typography>
            </Stack>
          </CardContent>
          {/* Likes */}
          <Box>
            <Box sx={{ flexDirection: 'colum', justifyContent: 'space-between' }}>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1,
                  fontSize: 'clamp(0.5rem, 0.9vw, 1rem)',
                  fontWeight: '700',
                  mb: 0.5,
                }}
              >
                {price?.mmc ?? 0} MMC
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ lineHeight: 1, fontSize: 'clamp(0.1rem, 0.8vw, 0.7rem)', fontWeight: '700' }}
              >
                {price?.usd ?? 0} USD
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PosterMini;
