import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import MovieCommentForm from './movie-details-comment-form';
import PostCommentList from './movie-comments-list';

// ----------------------------------------------------------------------

type Props = {
  id: string; // ID of the post
};

const PublicationDetailsComments = ({ id }: Props) => (
    <>
      {/* Comment Form for Top-Level Comments */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <MovieCommentForm commentOn={id} />
      </Box>

       <Divider sx={{ mt: 2, mb: 2 }} />

      {/* List of Top-Level Comments */}
      <PostCommentList publicationId={id} showReplies />
    </>
  )

export default PublicationDetailsComments;
