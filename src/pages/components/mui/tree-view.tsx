import { Helmet } from 'react-helmet-async';
// sections
import TreeViews from 'src/sections/_examples/mui/tree-view';

// ----------------------------------------------------------------------

export default function TreeViewPage() {
  return (
    <>
      <Helmet>
        <title> MUI: TreeView</title>
      </Helmet>

      <TreeViews />
    </>
  );
}
