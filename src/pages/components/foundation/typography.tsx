import { Helmet } from 'react-helmet-async';
// sections
import { TypographyView } from 'src/sections/_examples/foundation';

// ----------------------------------------------------------------------

export default function TypographyPage() {
  return (
    <>
      <Helmet>
        <title> Foundations: Typography</title>
      </Helmet>

      <TypographyView />
    </>
  );
}
