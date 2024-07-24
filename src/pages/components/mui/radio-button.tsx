import { Helmet } from 'react-helmet-async';
// sections
import RadioButtonView from 'src/sections/_examples/mui/radio-button-view';

// ----------------------------------------------------------------------

export default function RadioButtonPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Radio Button</title>
      </Helmet>

      <RadioButtonView />
    </>
  );
}
