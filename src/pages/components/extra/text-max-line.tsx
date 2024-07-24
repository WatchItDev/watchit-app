import { Helmet } from 'react-helmet-async';
// sections
import TextMaxLineView from 'src/sections/_examples/extra/text-max-line-view';

// ----------------------------------------------------------------------

export default function TextMaxLinePage() {
  return (
    <>
      <Helmet>
        <title> Extra: Text Max Line</title>
      </Helmet>

      <TextMaxLineView />
    </>
  );
}
