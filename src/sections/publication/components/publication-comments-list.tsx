import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useMemo } from 'react';
import { CommentReplyContext, PostCommentListProps } from '@src/sections/publication/types.ts';
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
  const shouldFetch = initialData === undefined;
  const postId = Number(publicationId);
  const skipQuery = Number.isNaN(postId) || !shouldFetch;

  const { data, loading: queryLoading, error, refetch } = useGetCommentsQuery({
    variables: { input: { postId }, page: { limit: 50 } },
    fetchPolicy: 'network-only',
    skip: skipQuery,
  });

  const source = useMemo(() => {
    return initialData ?? data?.getComments ?? [];
  }, [data?.getComments, initialData]);

  if (error) return <p>Error: {error.message}</p>;

  const isLoading = loading ?? (shouldFetch ? queryLoading : false);
  const comments = source.filter((comment) => !comment.parent);

  const repliesByRoot = useMemo(() => {
    const map = new Map<number, CommentReplyContext[]>();
    if (!source.length) return map;

    const byId = new Map<number, Comment>();
    source.forEach((comment) => byId.set(comment.id, comment));

    const getDisplayName = (comment?: Comment | null) => {
      const user = comment?.base?.user;
      if (!user) return null;
      return user.displayName ?? user.profile?.username ?? null;
    };

    const findRootId = (comment: Comment): number | null => {
      let parent = comment.parent;
      while (parent) {
        const parentComment = byId.get(parent.id);
        if (!parentComment) return parent.id;
        if (!parentComment.parent) return parent.id;
        parent = parentComment.parent;
      }
      return null;
    };

    source.forEach((comment) => {
      if (!comment.parent) return;
      const rootId = findRootId(comment);
      if (!rootId) return;
      const parentId = comment.parent.id;
      const replies = map.get(rootId) ?? [];
      const parentComment = byId.get(parentId);
      const replyingToName = parentId !== rootId ? getDisplayName(parentComment) : null;
      replies.push({ comment, replyingToName });
      map.set(rootId, replies);
    });

    return map;
  }, [source]);

  const handleRefresh = () => {
    if (shouldFetch && !Number.isNaN(postId)) void refetch();
    onRequestRefresh?.();
  };

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
            depth={0}
            replies={repliesByRoot.get(c.id)}
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
