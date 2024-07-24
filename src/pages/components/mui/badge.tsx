import { Helmet } from 'react-helmet-async';
// sections
import BadgeView from 'src/sections/_examples/mui/badge-view';

// ----------------------------------------------------------------------

export default function BadgePage() {
  return (
    <>
      <Helmet>
        <title> MUI: Badge</title>
      </Helmet>

      <BadgeView />
    </>
  );
}
