import { Helmet } from 'react-helmet-async';
// sections
import { MovieListView } from 'src/sections/movie/view';

// ----------------------------------------------------------------------

export default function MovieListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Movie List</title>
      </Helmet>

      <MovieListView />
    </>
  );
}
