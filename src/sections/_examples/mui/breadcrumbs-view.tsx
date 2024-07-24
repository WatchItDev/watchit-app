// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function BreadcrumbsView() {
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
            heading="Breadcrumbs"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Breadcrumbs' },
            ]}
            moreLink={['https://mui.com/components/custom-breadcrumbs']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock
            title="Text"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Breadcrumbs>
              <Link color="inherit" href="#">
                Material-UI
              </Link>
              <Link color="inherit" href="#">
                Core
              </Link>
              <Typography sx={{ color: 'text.primary' }}>Breadcrumb</Typography>
            </Breadcrumbs>
          </ComponentBlock>

          <ComponentBlock
            title="With Icon"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Breadcrumbs>
              <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="eva:home-fill" sx={{ mr: 0.5 }} />
                Material-UI
              </Link>
              <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify icon="eva:camera-fill" sx={{ mr: 0.5 }} />
                Core
              </Link>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                }}
              >
                <Iconify icon="solar:bell-bing-bold-duotone" sx={{ mr: 0.5 }} />
                Breadcrumb
              </Typography>
            </Breadcrumbs>
          </ComponentBlock>

          <ComponentBlock title="Customized" spacing={5}>
            <CustomBreadcrumbs
              sx={{ width: 1 }}
              links={[
                {
                  name: 'Home',
                  href: '#',
                  icon: <Iconify icon="eva:home-fill" />,
                },
                {
                  name: 'Link1',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                {
                  name: 'Link2',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                {
                  name: 'Link3',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                { name: 'Link4', icon: <Iconify icon="eva:cube-outline" /> },
              ]}
            />

            <CustomBreadcrumbs
              sx={{ width: 1 }}
              heading="Heading"
              links={[
                {
                  name: 'Home',
                  href: '#',
                  icon: <Iconify icon="eva:home-fill" />,
                },
                {
                  name: 'Link1',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                {
                  name: 'Link2',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                {
                  name: 'Link3',
                  href: '#',
                  icon: <Iconify icon="eva:cube-outline" />,
                },
                { name: 'Link4', icon: <Iconify icon="eva:cube-outline" /> },
              ]}
              action={
                <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
                  New Product
                </Button>
              }
            />
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
