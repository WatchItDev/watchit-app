import { Helmet } from 'react-helmet-async';
// sections
import { GridView } from 'src/sections/_examples/foundation';

// ----------------------------------------------------------------------

export default function GridPage() {
  return (
    <>
      <Helmet>
        <title> Foundations: Grid</title>
      </Helmet>

      <GridView />
    </>
  );
}
