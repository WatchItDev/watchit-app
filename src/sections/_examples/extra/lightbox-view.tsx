import { useState } from 'react';
import { Slide, SlideImage } from 'yet-another-react-lightbox';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import Image from 'src/components/image';
import Lightbox, { useLightBox, SlideVideo } from 'src/components/lightbox';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const images = [...Array(4)].map((_, index) => ({
  src: _mock.image.cover(index + 1),
  title: 'Flamingo',
  description: 'Vicko Mozara \n Veliki zali, Dubravica, Croatia',
}));

const slides: Slide[] = [
  ...images,
  {
    type: 'video',
    width: 1280,
    height: 720,
    poster:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    sources: [
      {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
      },
    ],
  },
];

// ----------------------------------------------------------------------

export default function LightboxView() {
  const lightbox = useLightBox(slides);

  const [state, setState] = useState({
    disabledZoom: false,
    disabledVideo: false,
    disabledTotal: false,
    disabledCaptions: false,
    disabledSlideshow: false,
    disabledThumbnails: false,
    disabledFullscreen: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Lightbox"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Lightbox' },
            ]}
            moreLink={['https://www.npmjs.com/package/yet-another-react-lightbox']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={9}>
              <Box
                gap={1}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
              >
                {slides.map((slide) => {
                  const thumbnail =
                    slide.type === 'video'
                      ? (slide as SlideVideo).poster
                      : (slide as SlideImage).src;

                  return (
                    <Image
                      key={thumbnail}
                      alt={thumbnail}
                      src={thumbnail}
                      ratio="1/1"
                      onClick={() => lightbox.onOpen(`${thumbnail}`)}
                      sx={{
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                    />
                  );
                })}
              </Box>
            </Grid>

            <Grid xs={12} md={3}>
              <Paper sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 2 }}>
                <FormControl component="fieldset" variant="standard">
                  <Stack spacing={2}>
                    <FormLabel component="legend" sx={{ typography: 'body2' }}>
                      Controls
                    </FormLabel>

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledZoom"
                          checked={state.disabledZoom}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Zoom"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledTotal"
                          checked={state.disabledTotal}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Total"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledVideo"
                          checked={state.disabledVideo}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Video"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledCaptions"
                          checked={state.disabledCaptions}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Captions"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledSlideshow"
                          checked={state.disabledSlideshow}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Slideshow"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledThumbnails"
                          checked={state.disabledThumbnails}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Thumbnails"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          name="disabledFullscreen"
                          checked={state.disabledFullscreen}
                          onChange={handleChange}
                        />
                      }
                      label="Disabled Fullscreen"
                    />
                  </Stack>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        slides={slides}
        index={lightbox.selected}
        disabledZoom={state.disabledZoom}
        disabledTotal={state.disabledTotal}
        disabledVideo={state.disabledVideo}
        disabledCaptions={state.disabledCaptions}
        disabledSlideshow={state.disabledSlideshow}
        disabledThumbnails={state.disabledThumbnails}
        disabledFullscreen={state.disabledFullscreen}
      />
    </>
  );
}
