import { Helmet } from 'react-helmet-async';
// sections
import EditorView from 'src/sections/_examples/extra/editor-view';

// ----------------------------------------------------------------------

export default function EditorPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Editor</title>
      </Helmet>

      <EditorView />
    </>
  );
}
