import { Helmet } from 'react-helmet-async';
// sections
import MarkdownView from 'src/sections/_examples/extra/markdown-view';

// ----------------------------------------------------------------------

export default function MarkdownPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Markdown</title>
      </Helmet>

      <MarkdownView />
    </>
  );
}
