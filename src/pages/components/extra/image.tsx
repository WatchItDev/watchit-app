import { Helmet } from 'react-helmet-async';
// sections
import ImageView from 'src/sections/_examples/extra/image-view';

// ----------------------------------------------------------------------

export default function ImagePage() {
  return (
    <>
      <Helmet>
        <title> Extra: Image</title>
      </Helmet>

      <ImageView />
    </>
  );
}
