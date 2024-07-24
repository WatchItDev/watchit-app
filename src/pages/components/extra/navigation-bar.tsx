import { Helmet } from 'react-helmet-async';
// sections
import NavigationBarView from 'src/sections/_examples/extra/navigation-bar-view';

// ----------------------------------------------------------------------

export default function NavigationBarPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Navigation Bar</title>
      </Helmet>

      <NavigationBarView />
    </>
  );
}
