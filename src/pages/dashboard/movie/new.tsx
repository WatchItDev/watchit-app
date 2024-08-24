import { Helmet } from 'react-helmet-async';
// sections
import { MovieCreateView } from 'src/sections/movie/view';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new movie</title>
      </Helmet>

      <MovieCreateView />
    </>
  );
}
