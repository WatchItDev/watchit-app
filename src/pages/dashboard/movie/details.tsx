import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { MovieDetailsView } from 'src/sections/movie/view';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Movie Details</title>
      </Helmet>

      <MovieDetailsView id={`${id}`} />
    </>
  );
}
