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
import { IconHeartFilled, IconStarFilled } from '@tabler/icons-react';
import { Poster } from '../types';

// ----------------------------------------------------------------------

const PosterHorizontal = ({ title, images, rating, year, likes, price, genre }: Poster) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor:'transparent'
      }}
    >
      {/* Poster image */}
      <Image style={{borderRadius:'10px'}} alt={title} src={images.vertical} ratio='16/9' />

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
        <Box sx={{display:'flex',alignItems:'center',justifyContent: 'space-between'}}>
          <Stack  direction="row" spacing={0.5} alignItems='center' textAlign='center'>
            <IconHeartFilled style={{marginBottom:'2px'}} size={13} color="#F2F3F5" />
            <Typography style={{fontSize: 'clamp(0.1rem, 0.8vw, 0.9rem)',whiteSpace: 'nowrap'}} variant="body2">{likes}K</Typography>
          </Stack>
          <Box>
            <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.9rem)'/* ,whiteSpace: 'nowrap'  */}}>
              {price.wvc} WVC
            </Typography>
          </Box>
        </Box>

        {/* Price WVC & USD */}
        <Stack alignItems='flex-end'>
          <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.8vw, 0.5rem)',whiteSpace: 'nowrap' }}>
            {price.usd} USD
          </Typography>
        </Stack>
      </Box>

      {/* Downside: Title & details */}
      <CardContent
        sx={{
          width: '100%',
          padding:'0px 8px 4px 8px',
          textAlign: 'left',
          color: 'common.white',
          marginTop:'10px'
        }}
      >
        {/* Title */}
        <Typography style={{fontSize: 'clamp(0.5rem, 1vw, 2rem)'}} noWrap variant='h6' sx={{ mb: 1 }}>
          {title}
        </Typography>

        {/* Details: Rating, Year, Genre */}
        <Stack sx={{overflow: 'hidden'}} direction="row" spacing={1} alignItems='center'>
          <IconStarFilled size={12} color="#FFCD19" />
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap'}} variant='body2'>{rating}</Typography>
          <Typography sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',whiteSpace: 'nowrap'}} variant='body2'>|  {year}</Typography>
          <Typography
            sx={{fontSize: 'clamp(0.1rem, 0.8vw, 2rem)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'}}
            variant="body2">
            |  {genre}
          </Typography>
        </Stack>
      </CardContent>
    </Paper>
  );
}

export default PosterHorizontal
