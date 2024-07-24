import { Helmet } from 'react-helmet-async';
// sections
import BreadcrumbsView from 'src/sections/_examples/mui/breadcrumbs-view';

// ----------------------------------------------------------------------

export default function BreadcrumbsPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Breadcrumbs</title>
      </Helmet>

      <BreadcrumbsView />
    </>
  );
}
