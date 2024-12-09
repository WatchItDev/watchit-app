import Box from '@mui/material/Box';
import { publicationId, useLazyPublications } from '@lens-protocol/react-web';

import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
  publicationId: string;
  showReplies?: boolean;
  refetchTrigger?: number;
};

export default function PostCommentList({ publicationId: id, showReplies, refetchTrigger }: Props) {
  const { data: comments, error, loading, execute } = useLazyPublications();

  useEffect(() => {
    (async () => {
      const result = await execute({
        where: {
          commentOn: {
            id: publicationId(id),
          },
        }
      });

      if (result.isFailure()) {
        console.log('Error trying to get comments');
        return;
      }
    })()
  }, [refetchTrigger]);

  if (loading)
    return (
      <LinearProgress
        color="inherit"
        sx={{ width: 1, maxWidth: 360, marginTop: '16px', alignSelf: 'center' }}
      />
    );
  if (error) return <p>Error loading comments: {error.message}</p>;

  return (
    <>
      {comments?.map((comment: any) => {
        // Destructure necessary data from the comment
        const { id: commentId } = comment;

        return (
          <Box key={commentId} width="100%">
            <PublicationCommentItem comment={comment} canReply={showReplies} />
          </Box>
        );
      })}
    </>
  );
}
