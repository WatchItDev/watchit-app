import { Helmet } from 'react-helmet-async';
// sections
import DataGridView from 'src/sections/_examples/mui/data-grid-view';

// ----------------------------------------------------------------------

export default function DataGridPage() {
  return (
    <>
      <Helmet>
        <title> MUI: DataGrid</title>
      </Helmet>

      <DataGridView />
    </>
  );
}
