import { Helmet } from 'react-helmet-async';
// sections
import ScrollView from 'src/sections/_examples/extra/scroll-view';

// ----------------------------------------------------------------------

export default function ScrollPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Scroll</title>
      </Helmet>

      <ScrollView />
    </>
  );
}
