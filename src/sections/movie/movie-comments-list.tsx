// @mui
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
// types
import { IPostComment } from 'src/types/blog';
//
import MovieCommentItem from './movie-comment-item';

// ----------------------------------------------------------------------

type Props = {
  comments: IPostComment[];
  id: string;
};

export default function PostCommentList({ comments, id }: Props) {
  return (
    <>
      <>
        {comments.map((comment) => {
          const { id: commentId, replyComment, name, users, message, avatarUrl, postedAt } = comment;

          const hasReply = !!replyComment.length;

          return (
            <Box key={commentId}>
              <MovieCommentItem
                name={name}
                message={message}
                postedAt={postedAt}
                avatarUrl={avatarUrl}
              />
              {hasReply &&
                replyComment.map((reply) => {
                  const userReply = users.find((user) => user.id === reply.userId);

                  return (
                    <MovieCommentItem
                      key={reply.id}
                      name={userReply?.name || ''}
                      message={reply.message}
                      postedAt={reply.postedAt}
                      avatarUrl={userReply?.avatarUrl || ''}
                      tagUser={reply.tagUser}
                      hasReply
                    />
                  );
                })}
            </Box>
          );
        })}
      </>

      <Pagination count={8} sx={{ my: 5, mx: 'auto' }} />
    </>
  );
}
