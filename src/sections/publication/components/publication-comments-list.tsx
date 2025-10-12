import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useMemo, useState } from 'react';
import { PostCommentListProps } from '@src/sections/publication/types.ts';
import { useGetCommentsQuery } from '@src/graphql/hooks/comments';
import type { Comment } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export default function PostCommentList({
  publicationId,
  onReplyCreated,
  showReplies = true,
  initialData,
  loading,
  onRequestRefresh,
}: Readonly<PostCommentListProps>) {
  const [hidden, setHidden] = useState<number[]>([]);
  const shouldFetch = initialData === undefined;
  const postId = Number(publicationId);
  const skipQuery = Number.isNaN(postId) || !shouldFetch;

  const { data, loading: queryLoading, error, refetch } = useGetCommentsQuery({
    variables: { input: { postId }, page: { limit: 50 } },
    fetchPolicy: 'network-only',
    skip: skipQuery,
  });

  const source = useMemo(() => {
    const list = initialData ?? data?.getComments ?? [];
    return list.filter((c) => !hidden.includes(c.id));
  }, [data?.getComments, hidden, initialData]);

  if (error) return <p>Error: {error.message}</p>;

  const isLoading = loading ?? (shouldFetch ? queryLoading : false);
  const comments = source.filter((comment) => !comment.parent);

  const handleRefresh = () => {
    if (shouldFetch && !Number.isNaN(postId)) void refetch();
    onRequestRefresh?.();
  };

  const handleHide = (commentId: number) => setHidden((h) => [...h, commentId]);

  return (
    <>
      {isLoading && (
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
            onHide={() => handleHide(c.id)}
            onReplyCreated={() => {
              handleRefresh();
              onReplyCreated();
            }}
            showReplies={showReplies}
          />
        </Box>
      ))}
    </>
  );
}
