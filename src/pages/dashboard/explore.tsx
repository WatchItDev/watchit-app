import { Helmet } from 'react-helmet-async';
import { ExploreView } from '@src/sections/explore';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {

  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <ExploreView />
    </>
  );
}
