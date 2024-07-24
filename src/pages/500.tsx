import { Helmet } from 'react-helmet-async';
// sections
import { View500 } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> 500 Internal Server Error</title>
      </Helmet>

      <View500 />
    </>
  );
}
