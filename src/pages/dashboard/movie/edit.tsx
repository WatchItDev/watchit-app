import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { MovieEditView } from 'src/sections/movie/view';

// ----------------------------------------------------------------------

export default function MovieEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Movie Edit</title>
      </Helmet>

      <MovieEditView id={`${id}`} />
    </>
  );
}
