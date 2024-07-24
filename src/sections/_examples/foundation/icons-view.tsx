// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function IconsView() {
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
            heading="Icons"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Icons' },
            ]}
            moreLink={[
              'https://mui.com/components/material-icons',
              'https://iconify.design/icon-sets',
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock title="Material Icons">
            <Link
              href="https://mui.com/components/icons/#main-content"
              target="_blank"
              rel="noopener"
            >
              https://mui.com/components/icons/#main-content
            </Link>
          </ComponentBlock>

          <ComponentBlock title="Iconify Icons">
            <Tooltip title="Iconify">
              <Iconify icon="eva:color-palette-fill" width={24} />
            </Tooltip>

            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'action.active' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'action.disabled' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'primary.main' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'secondary.main' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'info.main' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'success.main' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'warning.main' }} />
            <Iconify icon="eva:color-palette-fill" width={24} sx={{ color: 'error.main' }} />
          </ComponentBlock>

          <ComponentBlock title="Local Icons">
            <Tooltip title="SvgColor">
              <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" />
            </Tooltip>

            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'action.active' }} />
            <SvgColor
              src="/assets/icons/navbar/ic_dashboard.svg"
              sx={{ color: 'action.disabled' }}
            />
            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'primary.main' }} />
            <SvgColor
              src="/assets/icons/navbar/ic_dashboard.svg"
              sx={{ color: 'secondary.main' }}
            />
            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'info.main' }} />
            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'success.main' }} />
            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'warning.main' }} />
            <SvgColor src="/assets/icons/navbar/ic_dashboard.svg" sx={{ color: 'error.main' }} />
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
