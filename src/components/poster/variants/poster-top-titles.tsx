// @mui
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// components is used to import the Image component
import Image from '@src/components/image';
import { Poster } from '../types';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths.ts';
import {StackItem} from "@src/components/poster/variants/poster-trending-topic.tsx";
import Button from '@mui/material/Button';
import {
  IconDeviceTv,
  IconPlayerPlay,
  IconRosetteDiscountCheckFilled
} from '@tabler/icons-react';
import Box from "@mui/material/Box";
import TextMaxLine from "@src/components/text-max-line";

// ----------------------------------------------------------------------

const PosterTopTitles = ({ title, images, id, synopsis }: Poster) => {
  const router = useRouter();

  const handlePosterClick = () => {
    router.push(paths.dashboard.publication.details(id));
  }

  return (
    <Stack
      spacing={3}
      direction={{
        xs: 'column',
        lg: 'row',
      }}
      sx={{
        minWidth: '100%',
        borderRadius: 10,
        position: 'relative',
        padding: {
          xs: '90px 0px 0px 0px',
          sm: '0',
          md: '0',
          lg: '90px !important',
        },
      }}
    >
      <Box
        sx={{
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
        }}
      ></Box>
      <StackItem sx={{ minWidth: '50%', background: 'transparent', padding: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: '400px',
            }}
            alt={title}
            src={images.vertical}
            ratio="1/1"
          />
        </Box>
      </StackItem>
      <StackItem
        sx={{
          // maxWidth responsive
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '50%' },
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          padding: '0 0 0 10px',
        }}
      >
        <Paper
          sx={{
            backgroundColor: 'transparent',
            borderRadius: 2,
            overflow: 'hidden',
            verticalAlign: 'middle',
            cursor: 'pointer',
          }}
          onClick={handlePosterClick}
        >
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
            <Stack spacing={1} gap={'20px'}>
              <TextMaxLine line={2} variant="h3" sx={{ mb: 1 }}>
                {title}
              </TextMaxLine>

              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Stack
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  onClick={() => alert('Clicked')}
                >
                  <Typography style={{ marginRight: 5 }} variant="caption">
                    by
                  </Typography>
                  <Typography
                    style={{
                      gap: 4,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,.9)',
                      padding: '4px 10px',
                      borderRadius: 5,
                    }}
                    variant="caption"
                  >
                    <Image
                      ratio={'1/1'}
                      style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                      src={images.vertical}
                    ></Image>
                    Jhon Doe <IconRosetteDiscountCheckFilled />
                  </Typography>
                </Stack>
              </Box>

              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                }}
                variant="h6"
              >
                {synopsis}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#000',
                    height: '40px',
                  }}
                >
                  <Box sx={{ marginRight: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    xs: 0,
                    lg: '4px',
                    }}}>
                    <IconPlayerPlay size={22} color="#000" />
                  </Box>
                  <TextMaxLine  sx={{
                    display: {
                      xs: 'none',
                      lg: 'inline',
                    }}} line={1} variant="button">
                    Watch now
                  </TextMaxLine>
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    height: '40px',
                  }}
                >
                  <Box sx={{ marginRight: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      xs: 0,
                      lg: '4px',
                    }}}>
                    <IconDeviceTv size={22} color="#FFFFFF" />
                  </Box>

                  <TextMaxLine sx={{
                    display: {
                      xs: 'none',
                      lg: 'inline',
                  }}} line={1} variant="button">
                    Add watchlist
                  </TextMaxLine>
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
