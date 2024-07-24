import { Helmet } from 'react-helmet-async';
// sections
import ChipView from 'src/sections/_examples/mui/chip-view';

// ----------------------------------------------------------------------

export default function ChipPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Chip</title>
      </Helmet>

      <ChipView />
    </>
  );
}
