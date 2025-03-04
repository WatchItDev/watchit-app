import { Helmet } from 'react-helmet-async';
// sections
import { Error404View } from '@src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <Error404View />
    </>
  );
}
