// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DataGridBasic from './data-grid-basic';
import DataGridCustom from './data-grid-custom';

// ----------------------------------------------------------------------

const _dataGrid = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'alway') || (index % 4 && 'busy') || 'offline';

  return {
    id: _mock.id(index),
    status,
    email: _mock.email(index),
    name: _mock.fullName(index),
    age: _mock.number.age(index),
    lastLogin: _mock.time(index),
    isAdmin: _mock.boolean(index),
    lastName: _mock.lastName(index),
    rating: _mock.number.rating(index),
    firstName: _mock.firstName(index),
    performance: _mock.number.percent(index),
  };
});

// ----------------------------------------------------------------------

export default function DataGridView() {
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
            heading="DataGrid"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'DataGrid' },
            ]}
            moreLink={['https://mui.com/x/react-data-grid/']}
            sx={{ mb: 0 }}
          />

          <Typography variant="body2" sx={{ my: 3 }}>
            This component includes 2 <strong>Free</strong> and <strong>Paid</strong> versions from
            MUI.
            <br />
            Paid version will have more features. Please read more{' '}
            <Link href="https://mui.com/x/react-data-grid/" target="_blank" rel="noopener">
              here
            </Link>
          </Typography>
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            <CardHeader title="Basic" sx={{ mb: 2 }} />
            <Box sx={{ height: 390 }}>
              <DataGridBasic data={_dataGrid} />
            </Box>
          </Card>

          <Card>
            <CardHeader title="Custom" sx={{ mb: 2 }} />
            <Box sx={{ height: 720 }}>
              <DataGridCustom data={_dataGrid} />
            </Box>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
