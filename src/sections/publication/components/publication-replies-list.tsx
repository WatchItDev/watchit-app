import { useEffect } from 'react';
import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';
import { RepliesListProps } from '@src/sections/publication/types.ts';
import {RootState} from "@redux/store.ts"
import { Comment } from '@src/graphql/generated/graphql.ts';
import { useGetRepliesByCommentQuery } from '@src/graphql/generated/hooks.tsx';

const RepliesList = ({ parentCommentId }: RepliesListProps) => {
  const { data, error, loading, refetch } = useGetRepliesByCommentQuery({ variables: { commentId: parentCommentId } });
  const { hiddenComments, refetchTriggerByPublication } = useSelector(
    (state: RootState) => state.comments
  );
  const refetchTrigger = refetchTriggerByPublication[parentCommentId] || 0;
  const replies: Comment[] = data?.getRepliesByComment ?? [];

  useEffect(() => {
    refetch({ variables: { commentId: parentCommentId } });
  }, [refetchTrigger]);

  if (error) return <p>Error loading replies: {error.message}</p>;

  const repliesFiltered = replies.filter((comment) =>
    !hiddenComments.some((hiddenComment: Comment) => hiddenComment.id === comment.id)
  );

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
      {repliesFiltered?.map((reply: Comment) => {
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
