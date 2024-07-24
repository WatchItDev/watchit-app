import { Helmet } from 'react-helmet-async';
// sections
import CopyToClipboardView from 'src/sections/_examples/extra/copy-to-clipboard-view';

// ----------------------------------------------------------------------

export default function CopyToClipboardPage() {
  return (
    <>
      <Helmet>
        <title> Extra: to Clipboard</title>
      </Helmet>

      <CopyToClipboardView />
    </>
  );
}
