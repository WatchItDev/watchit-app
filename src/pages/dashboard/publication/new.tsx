import { Helmet } from 'react-helmet-async';
// sections
import { PublicationCreateView } from '@src/sections/publication/view';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new movie</title>
      </Helmet>

      <PublicationCreateView />
    </>
  );
}
