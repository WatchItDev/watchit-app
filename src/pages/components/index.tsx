import { Helmet } from 'react-helmet-async';
// sections
import ComponentsView from 'src/sections/_examples/view';

// ----------------------------------------------------------------------

export default function ComponentsPage() {
  return (
    <>
      <Helmet>
        <title> Components</title>
      </Helmet>

      <ComponentsView />
    </>
  );
}
