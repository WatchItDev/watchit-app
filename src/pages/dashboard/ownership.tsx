import { Helmet } from 'react-helmet-async';
// sections
import BlankView from '../../sections/blank/view';
import ComingSoonView from '../../sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <>
      <Helmet>
        <title> WatchIt | Ownership</title>
      </Helmet>

      <BlankView>
        <ComingSoonView />
      </BlankView>
    </>
  );
}
