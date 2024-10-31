import Box from '@mui/material/Box';
import { usePublications, publicationId } from '@lens-protocol/react-web';

import MovieCommentItem from './movie-comment-item';
import RepliesList from './movie-replies-list';

// ----------------------------------------------------------------------

type Props = {
  publicationId: string;
  showReplies?: boolean
};

export default function PostCommentList({ publicationId: id, showReplies }: Props) {
  // Fetch top-level comments (where commentOn is the post ID)
  const { data: comments, loading, error } = usePublications({
    where: {
      commentOn: {
        id: publicationId(id),
      },
    },
  });

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

  return (
    <>
      {comments?.map((comment: any) => {
        // Destructure necessary data from the comment
        const { id: commentId, metadata, createdAt, by } = comment;

        return (
          <Box key={commentId} width="100%">
            <MovieCommentItem
              profile={by}
              message={metadata?.content}
              postedAt={new Date(createdAt)}
              commentId={commentId}
              canReply={showReplies}
            />
            {showReplies && (
              <RepliesList parentCommentId={commentId} />
            )}
          </Box>
        );
      })}
    </>
  );
}
