import Box from '@mui/material/Box';
import { LimitType, publicationId, usePublications } from '@lens-protocol/react-web';

import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

type Props = {
  publicationId: string;
  showReplies?: boolean
};

export default function PostCommentList({ publicationId: id, showReplies }: Props) {
  // Fetch top-level comments (where commentOn is the post ID)
  const { data: comments, loading, error, beforeCount, hasMore, next } = usePublications({
    where: {
      commentOn: {
        id: publicationId(id),
      },
    },
    limit: LimitType.Ten,
  });

  if (loading) return <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360, marginTop: '16px', alignSelf: 'center' }} />;
  if (error) return <p>Error loading comments: {error.message}</p>;

  console.log('hello coments')
  console.log(comments)
  console.log(beforeCount)
  console.log(hasMore)
  console.log(next)

  return (
    <>
      {comments?.map((comment: any) => {
        // Destructure necessary data from the comment
        const { id: commentId } = comment;

        return (
          <Box key={commentId} width="100%">
            <PublicationCommentItem
              comment={comment}
              canReply={showReplies}
            />
          </Box>
        );
      })}
    </>
  );
}
