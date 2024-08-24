import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostEditPage() {
  const params = useParams();

  const { title } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Post Edit</title>
      </Helmet>

      <PostEditView title={`${title}`} />
    </>
  );
}
