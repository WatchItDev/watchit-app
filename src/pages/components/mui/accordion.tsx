import { Helmet } from 'react-helmet-async';
// sections
import AccordionView from 'src/sections/_examples/mui/accordion-view';

// ----------------------------------------------------------------------

export default function AccordionPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Accordion</title>
      </Helmet>

      <AccordionView />
    </>
  );
}
