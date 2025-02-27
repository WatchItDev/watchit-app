import Box from '@mui/material/Box';
import { publicationId, useLazyPublications } from '@lens-protocol/react-web';

import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

interface Props {
  publicationId: string;
  showReplies?: boolean;
}

export default function PostCommentList({ publicationId: id, showReplies }: Props) {
  const pendingComments = useSelector((state: any) => state.comments.pendingComments);
  const { data: comments, error, loading, execute } = useLazyPublications();
  const { hiddenComments, refetchTriggerByPublication } = useSelector(
    (state: any) => state.comments
  );
  const refetchTrigger = refetchTriggerByPublication[id] || 0;

  useEffect(() => {
    (async () => {
      const result = await execute({
        where: {
          commentOn: {
            id: publicationId(id),
          },
        },
      });

      if (result.isFailure()) {
        console.log('Error trying to get comments');
        return;
      }
    })();
  }, [refetchTrigger]);

  if (error) return <p>Error loading comments: {error.message}</p>;

  // Join the comments with the pending comments but append the pending comments at the beginning of the list
  const commentsWithPending = pendingComments[id]
    ? [...pendingComments[id], ...(comments ?? [])]
    : comments;

  const commentsFiltered = (commentsWithPending ?? [])
    .filter(
      (comment) => !hiddenComments.some((hiddenComment: any) => hiddenComment.id === comment.id)
    )
    .filter((comment) => !comment.isHidden);

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
