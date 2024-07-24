// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import Image from 'src/components/image';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const RATIO = ['4/3', '3/4', '6/4', '4/6', '16/9', '9/16', '21/9', '9/21', '1/1'] as const;

const IMAGES = RATIO.map((ratio, index) => ({
  ratio,
  url: _mock.image.cover(index + 1),
}));

export default function ImageView() {
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
            heading="Image"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Image' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            <CardHeader title="List" />
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              sx={{ p: 3 }}
            >
              {IMAGES.map((img) => (
                <Image key={img.ratio} alt={img.ratio} src={img.url} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </Card>

          <Card>
            <CardHeader title="Aspect Ratio" />
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
              sx={{ p: 3 }}
            >
              {IMAGES.map((img) => (
                <Stack key={img.ratio} spacing={1}>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {img.ratio}
                  </Typography>

                  <Image alt={img.ratio} src={img.url} ratio={img.ratio} sx={{ borderRadius: 2 }} />
                </Stack>
              ))}
            </Box>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
