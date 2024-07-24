import { Helmet } from 'react-helmet-async';
// sections
import { IconsView } from 'src/sections/_examples/foundation';

// ----------------------------------------------------------------------

export default function IconsPage() {
  return (
    <>
      <Helmet>
        <title> Foundations: Icons</title>
      </Helmet>

      <IconsView />
    </>
  );
}
