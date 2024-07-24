import { Helmet } from 'react-helmet-async';
// sections
import TooltipView from 'src/sections/_examples/mui/tooltip-view';

// ----------------------------------------------------------------------

export default function TooltipPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Tooltip</title>
      </Helmet>

      <TooltipView />
    </>
  );
}
