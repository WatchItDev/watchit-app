import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { RepliesListProps } from '@src/sections/publication/types.ts';
import type { Comment } from '@src/graphql/generated/graphql.ts';
import { useGetCommentsQuery } from '@src/graphql/hooks/comments';

const RepliesList = ({ parentCommentId, onReplyCreated }: RepliesListProps) => {
  const { data, loading, error, refetch } = useGetCommentsQuery({
    variables: { input: { parentId: parentCommentId }, page: { limit: 40 } },
    fetchPolicy: 'network-only',
    skip: Number.isNaN(parentCommentId),
  });

  const [hidden, setHidden] = useState<number[]>([]);

  if (error) return <p>Error: {error.message}</p>;

  const replies = useMemo(() => {
    return (data?.getComments ?? []).filter((reply: Comment) => !hidden.includes(reply.id));
  }, [data?.getComments, hidden]);

  const handleHide = (id: number) => setHidden((h) => [...h, id]);

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
      {replies.map((reply: Comment) => (
        <PublicationCommentItem
          key={reply.id}
          comment={reply}
          hasReply
          onHide={() => handleHide(reply.id)}
          onReplyCreated={() => {
            refetch();
            onReplyCreated();
          }}
          showReplies={false}
        />
      ))}
    </Box>
  );
};

export default RepliesList;
