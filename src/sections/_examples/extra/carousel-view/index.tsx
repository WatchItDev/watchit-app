// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CarouselBasic1 from './carousel-basic-1';
import CarouselBasic2 from './carousel-basic-2';
import CarouselBasic3 from './carousel-basic-3';
import CarouselBasic4 from './carousel-basic-4';
import CarouselAnimation from './carousel-animation';
import CarouselThumbnail from './carousel-thumbnail';
import CarouselCenterMode from './carousel-center-mode';

// ----------------------------------------------------------------------

const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));

// ----------------------------------------------------------------------

export default function CarouselView() {
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
            heading="Carousel"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Carousel' },
            ]}
            moreLink={['https://react-slick.neostack.com']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          sx={{
            mb: 3,
            alignItems: 'flex-start',
          }}
        >
          <Card>
            <CardHeader title="Carousel Basic 1" />
            <CardContent>
              <CarouselBasic1 data={_carouselsExample.slice(0, 4)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Basic 2" />
            <CardContent>
              <CarouselBasic2 data={_carouselsExample.slice(4, 8)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Basic 3" />
            <CardContent>
              <CarouselBasic3 data={_carouselsExample.slice(8, 12)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Basic 4" />
            <CardContent>
              <CarouselBasic4 data={_carouselsExample.slice(12, 16)} />
            </CardContent>
          </Card>
        </Box>

        <Stack spacing={3}>
          <Card>
            <CardHeader title="Carousel Thumbnail" />
            <CardContent>
              <CarouselThumbnail data={_carouselsExample.slice(0, 8)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Center Mode" subheader="Customs shape & icon button" />
            <CardContent>
              <CarouselCenterMode data={_carouselsExample.slice(8, 16)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Animation" />
            <CardContent>
              <CarouselAnimation data={_carouselsExample.slice(12, 16)} />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
