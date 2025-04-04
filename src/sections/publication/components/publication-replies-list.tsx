import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { publicationId, useLazyPublications } from '@lens-protocol/react-web';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';
import { RepliesListProps } from '@src/sections/publication/types.ts';
import {RootState} from "@redux/store.ts"
import {AnyPublication} from "@lens-protocol/api-bindings"

const RepliesList = ({ parentCommentId }: RepliesListProps) => {
  const { data: replies, error, loading, execute } = useLazyPublications();
  const { hiddenComments, refetchTriggerByPublication, pendingComments } = useSelector(
    (state: RootState) => state.comments
  );
  const refetchTrigger = refetchTriggerByPublication[parentCommentId] || 0;

  useEffect(() => {
    (async () => {
      await execute({
        where: {
          commentOn: {
            id: publicationId(parentCommentId),
          },
        },
      });
    })();
  }, [refetchTrigger]);

  if (error) return <p>Error loading replies: {error.message}</p>;

  // Join the replies with the pending comments but append the pending comments at the beginning of the list
  const repliesWithPending = pendingComments[parentCommentId]
    ? [...pendingComments[parentCommentId], ...(replies ?? [])]
    : replies;

  const repliesFiltered = (repliesWithPending ?? [])
    .filter(
      (comment) => !hiddenComments.some((hiddenComment: AnyPublication) => hiddenComment.id === comment.id)
    )
    .filter((comment) => !comment.isHidden);

  return (
    <Box sx={{ ml: 0, mb: 1 }}>
      {loading && (
        <LinearProgress
          color="inherit"
          sx={{
            width: 1,
            maxWidth: 300,
            marginTop: '-8px',
            marginBottom: '16px',
            marginRight: '16px',
            alignSelf: 'flex-end',
            marginLeft: 'auto',
          }}
        />
      )}
      {repliesFiltered?.map((reply: AnyPublication) => {
        const { id: replyId } = reply;

        return (
          <Box key={replyId} sx={{ mb: 1 }}>
            <PublicationCommentItem
              comment={reply}
              hasReply
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default RepliesList;
