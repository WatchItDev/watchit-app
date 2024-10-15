import Divider from '@mui/material/Divider';
//
import MovieCommentForm from './movie-details-comment-form';
import PostCommentList from './movie-comments-list';
import { useGetPost } from '../../api/blog';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

const MovieDetailsComments = ({ id }: Props) => {
  const { post} = useGetPost('exploring-the-hidden-gems-of-destination');

  return (
    <>
      <MovieCommentForm id={id} />

      <Divider sx={{ mt: 5, mb: 2 }} />

      <PostCommentList comments={post.comments} id={id} />
    </>
  );
}

export default MovieDetailsComments
