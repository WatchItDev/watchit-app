import { Helmet } from 'react-helmet-async';
// sections
import TextfieldView from 'src/sections/_examples/mui/textfield-view';

// ----------------------------------------------------------------------

export default function TextfieldPage() {
  return (
    <>
      <Helmet>
        <title> MUI: TextField</title>
      </Helmet>

      <TextfieldView />
    </>
  );
}
