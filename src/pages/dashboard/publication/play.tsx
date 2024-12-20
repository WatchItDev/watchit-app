import { Helmet } from 'react-helmet-async';
// sections
import { PublicationPlayView } from '@src/sections/publication/view';
import { useParams } from '@src/routes/hooks';

// ----------------------------------------------------------------------

export default function MovieCreatePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new movie</title>
      </Helmet>

      <PublicationPlayView id={id} publication={undefined} loading={false} />
    </>
  );
}
