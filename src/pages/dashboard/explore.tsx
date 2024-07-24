import { Helmet } from 'react-helmet-async';
import ComingSoonView from '../../sections/coming-soon/view';
import BlankView from '../../sections/blank/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
