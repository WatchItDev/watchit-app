import { Helmet } from 'react-helmet-async';
// sections
import { MoviePlayView } from 'src/sections/movie/view';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new movie</title>
      </Helmet>

      <MoviePlayView id={id} />
    </>
  );
}
