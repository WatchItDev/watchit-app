import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import { varFade } from 'src/components/animate';
import { IconStarFilled, IconPlayerPlay, IconFlagFilled } from '@tabler/icons-react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { PosterVertical } from '../../poster';
import { Poster } from '../../poster/types';
import { useRouter } from '../../../routes/hooks';
import { paths } from '../../../routes/paths';
import { useSettingsContext } from '../../settings';

// ----------------------------------------------------------------------

type Props = {
  movie: Poster
};

export default function MovieDetailMain({ movie }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const settings = useSettingsContext();

  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;

  const handlePlay = () => {
    router.push(paths.dashboard.movie.details(movie.id));
  }

  return (
    <Paper sx={{ position: 'relative', boxShadow: 'none',}}>
      <Image dir="ltr" alt={movie.title} src={movie.images.vertical} ratio="21/9" />

      <Box sx={{
        bottom: 0,
        left: 0,
        zIndex: 8,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        position: 'absolute',
        ...bgGradient({
          direction: 'to top',
          startColor: `#1E1F22 0%`,
          endColor: `${alpha('#1E1F22', 0.2)} 100%`,
        }),
      }} />
      <Box sx={{
        bottom: 0,
        left: 0,
        zIndex: 7,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        position: 'absolute',
        ...bgGradient({
          direction: 'to top',
          startColor: `${alpha('#1E1F22', 0.7)} 30%`,
          endColor: `${alpha('#1E1F22', 0.2)} 100%`,
        }),
      }} />

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CardContent
          sx={{
            bottom: 0,
            left: 0,
            zIndex: 9,
            width: '100%',
            textAlign: 'left',
            position: 'absolute',
            color: 'common.white'
          }}
        >
          {/* Title */}
          <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between',paddingBottom:'30px'}}>
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'end', width: '60%'}}>
              {/* Title */}
              <m.div variants={variants}>
                <Typography sx={{ fontSize: 'clamp(2rem, 1vw, 3rem)', fontWeight: 'bold', lineHeight: 1.1, mb: 0.5 }} gutterBottom>
                  {movie.title}
                </Typography>
              </m.div>
              {/* Details: Rating, Year, Genre */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconStarFilled size={14} color="#FFCD19"/>
                  <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700' }} variant="body2">{movie.rating}</Typography>
                </Stack>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2">{movie.year}</Typography>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)'}} variant="body2" color="textSecondary">|</Typography>
                <Typography sx={{fontSize: 'clamp(0.3rem, 2vw + 1rem, 0.9rem)', fontWeight: '700'}} variant="body2" color="textSecondary">
                  { movie.genre.join('  -  ') }
                </Typography>
              </Stack>
              <Box>
                <m.div  variants={variants}>
                  <Typography sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '5',
                    WebkitBoxOrient: 'vertical',
                    fontWeight: '700'
                  }}
                              variant="body2" >
                    {movie.synopsis}
                  </Typography>
                </m.div>
              </Box>
              <m.div className='flex space-x-6' variants={variants}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant='contained'
                    sx={{
                      mt: 3 ,
                      color:'#FFFFFF',
                      background: 'linear-gradient(to right, #7B61FF 0%, #4A34B8 100%)',
                      height: '40px'
                    }}
                    onClick={handlePlay}
                  >
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                      <Stack spacing={0.5} direction="column" alignItems="flex-start" justifyContent="flex-start">
                        <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.5rem, 0.9vw, 1.1rem)', fontWeight: '700'}}>
                          Watch it!
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1 , fontSize: 'clamp(0.1rem, 0.7vw, 0.7rem)' }}>
                          {movie.price.wvc} MMC / {movie.price.usd} USD
                        </Typography>
                      </Stack>
                    </Stack>
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      height: '40px'
                    }}
                  >
                    <IconFlagFilled style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                    Add watchlist
                  </Button>
                </Stack>
              </m.div>
            </Box>
            <Box
              sx={{
                width:'200px',
                height:'100%',
                position:'relative',

              }}
            >
              <Box sx={{ width:'200px' }}>
                <PosterVertical sx={{ height:'100%' }} { ...movie } />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Container>
    </Paper>
  );
}






