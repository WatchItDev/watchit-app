import { Helmet } from 'react-helmet-async';
// sections
import MultiLanguageView from 'src/sections/_examples/extra/multi-language-view';

// ----------------------------------------------------------------------

export default function MultiLanguagePage() {
  return (
    <>
      <Helmet>
        <title> Extra: Multi Language</title>
      </Helmet>

      <MultiLanguageView />
    </>
  );
}
