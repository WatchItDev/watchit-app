import { Helmet } from 'react-helmet-async';
// sections
import StepperView from 'src/sections/_examples/mui/stepper-view';

// ----------------------------------------------------------------------

export default function StepperPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Stepper</title>
      </Helmet>

      <StepperView />
    </>
  );
}
