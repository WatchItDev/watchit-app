import { Helmet } from 'react-helmet-async';
// sections
import AnimateView from 'src/sections/_examples/extra/animate-view';

// ----------------------------------------------------------------------

export default function AnimatePage() {
  return (
    <>
      <Helmet>
        <title> Extra: Animate</title>
      </Helmet>

      <AnimateView />
    </>
  );
}
