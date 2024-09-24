// @mui
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import { bgGradient } from 'src/theme/css';
import Image from 'src/components/image';
import { IconHeartFilled, IconStarFilled } from '@tabler/icons-react';
import { Poster } from '../types';
import { useRouter } from '../../../routes/hooks';
import { paths } from '../../../routes/paths';

// ----------------------------------------------------------------------

const PosterVertical = ({ id, title, images, rating, year, likes, price, genre }: Poster) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.movie.details(id));
  }

  const formatLikes = (totalLikes: number) => {
    if (totalLikes >= 1000000) {
      return `${(totalLikes / 1000000).toFixed(1)  }M`;
    } if (totalLikes >= 1000) {
      return `${(totalLikes / 1000).toFixed(1)  }K`;
    }
    return totalLikes;
  };

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={handlePosterClick}
    >
      {/* Poster image */}
      <Image alt={title} src={images.vertical} ratio="4/6" />

      {/* Upper side: Likes & prices */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          p: 1,
          pb: 3,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'common.white',
          zIndex: 9,
          ...bgGradient({
            direction: 'to bottom',
            startColor: alpha('#000', 0.9),
            endColor: alpha('#000', 0),
          }),
        }}
      >
        {/* Likes */}
        <Box sx={{display:'flex',alignItems:'center',justifyContent: 'space-between'}}>
          <Stack  direction="row" spacing={0.5} alignItems='center' textAlign='center'>
            <IconHeartFilled style={{marginBottom:'2px'}} size={16} color="#F2F3F5" />
            <Typography style={{fontSize: 'clamp(0.1rem, 0.8vw, 0.9rem)', fontWeight: '700', whiteSpace: 'nowrap'}} variant="body2">
              {formatLikes(likes)}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.9rem)', fontWeight: '700'}}>
              {price.wvc} MMC
            </Typography>
          </Box>
        </Box>

        {/* Price WVC & USD */}
        <Stack alignItems='flex-end'>
          <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.8rem)', whiteSpace: 'nowrap' }}>
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
          padding:'16px 8px 12px 8px !important',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          ...bgGradient({
            direction: 'to top',
            startColor: alpha('#000', 0.9),
            endColor: alpha('#000', 0),
          }),
        }}
      >
        {/* Title */}
        <Typography
          variant='h6'
          sx={{
            mb: 1,
            fontSize: 'clamp(0.5rem, 1vw, 2rem)',
            lineHeight: 1.1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconStarFilled size={14} color="#FFCD19"/>
            <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '700' }} variant="body2">{rating}</Typography>
          </Stack>
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)'}} variant="body2" color="textSecondary">|</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '700'}} variant="body2">{year}</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)'}} variant="body2" color="textSecondary">|</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
            { genre[0] }
          </Typography>
        </Stack>
      </CardContent>
    </Paper>
  );
}

export default PosterVertical
