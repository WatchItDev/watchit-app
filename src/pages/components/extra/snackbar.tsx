import { Helmet } from 'react-helmet-async';
// sections
import SnackbarView from 'src/sections/_examples/extra/snackbar-view';

// ----------------------------------------------------------------------

export default function SnackbarPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Snackbar</title>
      </Helmet>

      <SnackbarView />
    </>
  );
}
