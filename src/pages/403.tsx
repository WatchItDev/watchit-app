import { Helmet } from 'react-helmet-async';
// sections
import { Error403View } from '@src/sections/error';

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Helmet>
        <title> 403 Forbidden</title>
      </Helmet>

      <Error403View />
    </>
  );
}
