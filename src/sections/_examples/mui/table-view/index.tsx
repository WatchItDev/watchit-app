// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BasicTable from './basic-table';
import CollapsibleTable from './collapsible-table';
import SortingSelectingTable from './sorting-selecting-table';
import GroupingFixedHeaderTable from './grouping-fixed-header-table';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function TableView() {
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
            heading="Table"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Table' },
            ]}
            moreLink={['https://mui.com/components/tables']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Basic Table" />
              <BasicTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <SortingSelectingTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Grouping & FixedHeader" />
              <GroupingFixedHeaderTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Collapsible Table" />
              <CollapsibleTable />
            </Card>
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
