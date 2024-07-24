import { Helmet } from 'react-helmet-async';
// sections
import SwitchView from 'src/sections/_examples/mui/switch-view';

// ----------------------------------------------------------------------

export default function SwitchPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Switch</title>
      </Helmet>

      <SwitchView />
    </>
  );
}
