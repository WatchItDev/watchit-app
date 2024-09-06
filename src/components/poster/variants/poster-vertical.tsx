// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import { bgGradient } from 'src/theme/css';
import Image from 'src/components/image';
import { IconHeartFilled } from '@tabler/icons-react';
import { Poster } from '../types';

// ----------------------------------------------------------------------

const PosterVertical = ({ title, images, rating, year, likes, price, genre }: Poster) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Poster image */}
      <Image alt={title} src={images.vertical} ratio="4/6" />

      {/* Upper side: Likes & prices */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
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
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconHeartFilled size={18} color="#F2F3F5" />
          <Typography style={{fontSize: 'clamp(0.1rem, 0.8vw, 0.8rem)',whiteSpace: 'nowrap'}} variant="body2">{likes}K</Typography>
        </Stack>

        {/* Price WVC & USD */}
        <Stack alignItems="flex-end">
          <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.8rem)',whiteSpace: 'nowrap' }}>
            {price.wvc} WVC
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.8rem)',whiteSpace: 'nowrap' }}>
            {price.usd} USD
          </Typography>
        </Stack>
      </Box>

      {/* Downside: Title & details */}
      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          ...bgGradient({
            direction: 'to top',
            startColor: `#000 25%`,
            endColor: `${alpha('#000', 0)} 100%`,
          }),
        }}
      >
        {/* Title */}
        <Typography style={{fontSize: 'clamp(0.5rem, 1vw, 2rem)'}} variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>

        {/* Details: Rating, Year, Genre */}
        <Stack sx={{overflow: 'hidden'}} direction="row" spacing={1} alignItems="center">
          <Typography sx={{fontSize: 'clamp(0.1rem, 1vw, 3rem)',whiteSpace: 'nowrap'}} variant="body2">{rating} ★</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 1vw, 3rem)',whiteSpace: 'nowrap'}} variant="body2">| {year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 1vw, 3rem)',overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',}} variant="body2">| {genre}</Typography>
        </Stack>
      </CardContent>
    </Paper>
  );
}

export default PosterVertical
