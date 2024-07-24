import { Helmet } from 'react-helmet-async';
// sections
import ScrollProgressView from 'src/sections/_examples/extra/scroll-progress-view';

// ----------------------------------------------------------------------

export default function ScrollProgressPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Scroll Progress</title>
      </Helmet>

      <ScrollProgressView />
    </>
  );
}
