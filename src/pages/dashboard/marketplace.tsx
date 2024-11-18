import { Helmet } from 'react-helmet-async';
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function OverviewEcommercePage() {
  return (
    <>
      <Helmet>
        <title> WatchIt | Marketplace</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
