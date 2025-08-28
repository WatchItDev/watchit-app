import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { PostCommentListProps } from '@src/sections/publication/types.ts';
import { useGetCommentsByPostQuery } from '@src/graphql/generated/hooks.tsx';
import { Comment } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export default function PostCommentList({
  publicationId,
  onReplyCreated,
}: Readonly<PostCommentListProps>) {
  const { data, loading, error, refetch } = useGetCommentsByPostQuery({
    variables: { postId: publicationId, limit: 50 },
    fetchPolicy: 'network-only',
    pollInterval: 1000,
  });

  const [hidden, setHidden] = useState<string[]>([]);
  if (error) return <p>Error: {error.message}</p>;
  const comments = (data?.getCommentsByPost ?? []).filter(
    (c: Comment) => !hidden.includes(c.id),
  );
  const handleHide = (commentId: string) => setHidden((h) => [...h, commentId]);

  return (
    <>
      {loading && (
        <LinearProgress
          color="inherit"
          sx={{
            width: 1,
            maxWidth: 360,
            marginBottom: '16px',
            alignSelf: 'center',
          }}
        />
      )}
      {comments.map((c: Comment) => (
        <Box key={c.id} width="100%">
          <PublicationCommentItem
            comment={c}
            canReply
            onHide={() => handleHide(c.id)}
            onReplyCreated={() => {
              refetch();
              onReplyCreated();
            }}
          />
        </Box>
      ))}
    </>
  );
}
