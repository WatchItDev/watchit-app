// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSnackbar, VariantType, SnackbarOrigin } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function SnackbarView() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onSnackbarAction = (color: VariantType, anchor?: SnackbarOrigin) => {
    enqueueSnackbar(`This is an ${color}`, {
      variant: color,
      anchorOrigin: anchor,
      action: (key) => (
        <>
          <Button
            size="small"
            color={color !== 'default' ? color : 'primary'}
            onClick={() => {
              console.info(`I belong to snackbar with key ${key}`);
            }}
          >
            Alert
          </Button>

          <Button size="small" color="inherit" onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        </>
      ),
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
            heading="Snackbar"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Snackbar' },
            ]}
            moreLink={['https://www.iamhosseindhv.com/notistack']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Simple">
            <Button
              variant="contained"
              color="inherit"
              onClick={() =>
                enqueueSnackbar('This is an default', {
                  variant: 'default',
                })
              }
            >
              Default
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() =>
                enqueueSnackbar('This is an info', {
                  variant: 'info',
                })
              }
            >
              Info
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() =>
                enqueueSnackbar('This is an success', {
                  variant: 'success',
                })
              }
            >
              Success
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                enqueueSnackbar('This is an warning', {
                  variant: 'warning',
                })
              }
            >
              Warning
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() =>
                enqueueSnackbar('This is an error', {
                  variant: 'error',
                })
              }
            >
              Error
            </Button>
          </ComponentBlock>

          <ComponentBlock title="With Action">
            <Button variant="contained" color="inherit" onClick={() => onSnackbarAction('default')}>
              Default
            </Button>
            <Button variant="contained" color="info" onClick={() => onSnackbarAction('info')}>
              Info
            </Button>
            <Button variant="contained" color="success" onClick={() => onSnackbarAction('success')}>
              Success
            </Button>
            <Button variant="contained" color="warning" onClick={() => onSnackbarAction('warning')}>
              Warning
            </Button>
            <Button variant="contained" color="error" onClick={() => onSnackbarAction('error')}>
              Error
            </Button>
          </ComponentBlock>

          <ComponentBlock title="anchorOrigin">
            <Button
              variant="text"
              color="inherit"
              onClick={() =>
                onSnackbarAction('default', {
                  vertical: 'top',
                  horizontal: 'left',
                })
              }
            >
              Top Left
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() =>
                onSnackbarAction('default', {
                  vertical: 'top',
                  horizontal: 'center',
                })
              }
            >
              Top Center
            </Button>
            <Button variant="text" color="inherit" onClick={() => onSnackbarAction('default')}>
              Top Right
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() =>
                onSnackbarAction('default', {
                  vertical: 'bottom',
                  horizontal: 'left',
                })
              }
            >
              Bottom Left
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() =>
                onSnackbarAction('default', {
                  vertical: 'bottom',
                  horizontal: 'center',
                })
              }
            >
              Bottom Center
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() =>
                onSnackbarAction('default', {
                  vertical: 'bottom',
                  horizontal: 'right',
                })
              }
            >
              Bottom Right
            </Button>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
