import { useState } from 'react';
import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { RepliesListProps } from '@src/sections/publication/types.ts';
import { Comment } from '@src/graphql/generated/graphql.ts';
import { useGetRepliesByCommentQuery } from '@src/graphql/generated/hooks.tsx';

const RepliesList = ({ parentCommentId, onReplyCreated }: RepliesListProps) => {
  const { data, loading, error, refetch } = useGetRepliesByCommentQuery({
    variables: { commentId: parentCommentId },
    fetchPolicy: 'network-only',
  });

  const [hidden, setHidden] = useState<string[]>([]);

  if (error) return <p>Error: {error.message}</p>;

  const replies = (data?.getRepliesByComment ?? []).filter(
    (r: Comment) => !hidden.includes(r.id),
  );

  const handleHide = (id: string) => setHidden((h) => [...h, id]);

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
        />
      ))}
    </Box>
  );
};

export default RepliesList;
