import { Helmet } from 'react-helmet-async';
// sections
import AlertView from 'src/sections/_examples/mui/alert-view';

// ----------------------------------------------------------------------

export default function AlertPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Alert</title>
      </Helmet>

      <AlertView />
    </>
  );
}
