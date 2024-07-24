import { Helmet } from 'react-helmet-async';
// sections
import ButtonView from 'src/sections/_examples/mui/button-view';

// ----------------------------------------------------------------------

export default function ButtonPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Button</title>
      </Helmet>

      <ButtonView />
    </>
  );
}
