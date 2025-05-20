import Box from '@mui/material/Box';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostCommentListProps } from '@src/sections/publication/types.ts';
import {RootState} from "@redux/store.ts"
import { useGetCommentsByPostLazyQuery } from '@src/graphql/generated/hooks.tsx';
import { Comment } from '@src/graphql/generated/graphql.ts';
import { setRepliesCount } from '@redux/comments';

// ----------------------------------------------------------------------

export default function PostCommentList({ publicationId: id, showReplies }: Readonly<PostCommentListProps>) {
  const dispatch = useDispatch();
  const [ comments, setComments ] = useState<Comment[]>([])
  const [ getComments, {data, error, loading} ] = useGetCommentsByPostLazyQuery();
  const { hiddenComments, refetchTriggerByPublication } = useSelector(
    (state: RootState) => state.comments
  );
  const refetchTrigger = refetchTriggerByPublication[id] || 0;

  useEffect(() => {
    setComments(data?.getCommentsByPost ?? [])
  }, [data?.getCommentsByPost]);

  useEffect(() => {
    data?.getCommentsByPost?.forEach((c: Comment) =>
      dispatch(setRepliesCount({ commentId: c.id, count: c.repliesCount })),
    );
  }, [data]);

  useEffect(() => {
    (async () => {
      const res = await getComments({ variables: { postId: id, limit: 50 } })
      setComments(res?.data?.getCommentsByPost ?? [])
    })()
  }, [refetchTrigger, id]);

  if (error) return <p>Error loading comments: {error.message}</p>;

  const commentsFiltered = comments.filter(
      (comment) => !hiddenComments.some((hiddenComment: Comment) => hiddenComment.id === comment.id)
    );

  return (
    <>
      {loading && (
        <LinearProgress
          color="inherit"
          sx={{ width: 1, maxWidth: 360, marginBottom: '16px', alignSelf: 'center' }}
        />
      )}
      {commentsFiltered?.map((comment: Comment) => {
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
