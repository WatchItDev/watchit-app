// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import FormDialog from './form-dialog';
import AlertDialog from './alert-dialog';
import ScrollDialog from './scroll-dialog';
import SimpleDialogs from './simple-dialog';
import MaxWidthDialog from './max-width-dialog';
import FullScreenDialog from './full-screen-dialog';
import TransitionsDialog from './transitions-dialog';
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function DialogView() {
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
            heading="Dialog"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Dialog' },
            ]}
            moreLink={['https://mui.com/components/dialogs']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 3 }} spacing={3}>
          <ComponentBlock title="Simple">
            <SimpleDialogs />
          </ComponentBlock>

          <ComponentBlock title="Alerts">
            <AlertDialog />
          </ComponentBlock>

          <ComponentBlock title="Transitions">
            <TransitionsDialog />
          </ComponentBlock>

          <ComponentBlock title="Form">
            <FormDialog />
          </ComponentBlock>

          <ComponentBlock title="Full Screen">
            <FullScreenDialog />
          </ComponentBlock>

          <ComponentBlock title="Max Width Dialog">
            <MaxWidthDialog />
          </ComponentBlock>

          <ComponentBlock title="Scrolling Content Dialogs">
            <ScrollDialog />
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
