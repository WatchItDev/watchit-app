import { Helmet } from 'react-helmet-async';
// sections
import FormValidationView from 'src/sections/_examples/extra/form-validation-view';

// ----------------------------------------------------------------------

export default function FormValidationPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Form Validation</title>
      </Helmet>

      <FormValidationView />
    </>
  );
}
