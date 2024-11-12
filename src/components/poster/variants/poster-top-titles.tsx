// @mui
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components
import Image from '@src/components/image';
import { Poster } from '../types';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import {StackItem} from "@src/components/poster/variants/poster-trending-topic.tsx";
import Button from '@mui/material/Button';
import { IconDeviceTv, IconPlayerPlay } from '@tabler/icons-react';
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const PosterTopTitles = ({ title, images, id, synopsis }: Poster) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.movie.details(id));
  }

  return (
    <Stack spacing={3} direction={'row'} sx={{minWidth: '100%', borderRadius: 10, padding:'90px', position: 'relative'}}>
      <Box sx={{
        borderRadius: '10px',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        backgroundImage: `url('https://wallpaperswide.com/download/star_wars_the_rise_of_skywalker_movie-wallpaper-1600x900.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} ></Box>
      <StackItem sx={{minWidth: '50%', background: 'transparent', padding: 0}}>
        <Image style={{borderRadius:'10px', boxShadow: '0 0 25px #CCC'}} alt={title} src={images.vertical} ratio='1/1' />
      </StackItem>
      <StackItem sx={{minWidth: '50%', display: 'flex', alignItems: 'center', background: 'transparent', padding: '0 0 0 10px'}}>
        <Paper
          sx={{
            backgroundColor: 'transparent',
            borderRadius: 2,
            overflow: 'hidden',
            verticalAlign: 'middle',
            cursor: 'pointer'
          }}
          onClick={handlePosterClick}
        >
          {/* Downside: Title & details */}
          <CardContent
            sx={{
              width: '100%',
              padding:'0px 8px 0px 8px !important',
              textAlign: 'left',
              color: 'common.white',
              marginTop:'10px'
            }}
          >
            {/* Title */}
            <Stack spacing={1} gap={'20px'}>
              <Typography style={{fontSize: 'clamp(2rem, 1vw, 2rem)'}} noWrap variant='h1' sx={{ mb: 1 }}>
                {title}
              </Typography>

              <Typography style={{fontSize: 'clamp(0.5rem, 1vw, 2rem)'}} variant='h6' sx={{ mb: 1 }}>
                {synopsis}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    borderColor: '#FFFFFF',
                    color: '#000',
                    height: '40px'
                  }}
                >
                  <IconPlayerPlay style={{marginRight:'4px'}} size={22} color='#000' />
                  Watch now
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
                  <IconDeviceTv style={{marginRight:'4px'}} size={22} color='#FFFFFF' />
                  Add watchlist
                </Button>
              </Stack>

            </Stack>
          </CardContent>
        </Paper>
      </StackItem>


    </Stack>
  );
}

export default PosterTopTitles
