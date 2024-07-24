import { Helmet } from 'react-helmet-async';
// sections
import UploadView from 'src/sections/_examples/extra/upload-view';

// ----------------------------------------------------------------------

export default function UploadPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Upload</title>
      </Helmet>

      <UploadView />
    </>
  );
}
