import { Helmet } from 'react-helmet-async';
// sections
import LightboxView from 'src/sections/_examples/extra/lightbox-view';

// ----------------------------------------------------------------------

export default function LightboxPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Lightbox</title>
      </Helmet>

      <LightboxView />
    </>
  );
}
