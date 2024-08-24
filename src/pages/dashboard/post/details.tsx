import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostDetailsPage() {
  const params = useParams();

  const { title } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Post Details</title>
      </Helmet>

      <PostDetailsView title={`${title}`} />
    </>
  );
}
