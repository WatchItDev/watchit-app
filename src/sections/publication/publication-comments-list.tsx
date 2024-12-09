import Box from '@mui/material/Box';
import { publicationId, useLazyPublications } from '@lens-protocol/react-web';

import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

type Props = {
  publicationId: string;
  showReplies?: boolean;
};

export default function PostCommentList({ publicationId: id, showReplies }: Props) {
  const { data: comments, error, loading, execute } = useLazyPublications();
  const { hiddenComments, refetchTriggerByPublication } = useSelector((state: any) => state.comments);
  const refetchTrigger = refetchTriggerByPublication[id] || 0;

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

  if (error) return <p>Error loading comments: {error.message}</p>;

  const commentsFiltered = (comments ?? [])
    .filter((comment) => !hiddenComments.some((hiddenComment: any) => hiddenComment.id === comment.id))
    .filter((comment) => !comment.isHidden)

  return (
    <>
      {loading && (
        <LinearProgress
          color="inherit"
          sx={{ width: 1, maxWidth: 360, marginBottom: '16px', alignSelf: 'center' }}
        />
      )}
      {commentsFiltered?.map((comment: any) => {
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
