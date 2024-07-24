import { Helmet } from 'react-helmet-async';
// sections
import PaginationView from 'src/sections/_examples/mui/pagination-view';

// ----------------------------------------------------------------------

export default function PaginationPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Pagination</title>
      </Helmet>

      <PaginationView />
    </>
  );
}
