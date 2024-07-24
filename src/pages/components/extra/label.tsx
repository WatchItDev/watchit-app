import { Helmet } from 'react-helmet-async';
// sections
import LabelView from 'src/sections/_examples/extra/label-view';

// ----------------------------------------------------------------------

export default function LabelPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Label</title>
      </Helmet>

      <LabelView />
    </>
  );
}
