import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import GovernanceCommentItem from './governance-comment-item'
import { IPostComment } from '@src/types/blog'

type Props = {
  comments: IPostComment[];
};

export default function GovernanceCommentList({ comments }: Props) {
  return (
    <>
      <>
        {comments.map((comment) => {
          const { id, replyComment, name, users, message, avatarUrl, postedAt } = comment

          const hasReply = !!replyComment.length

          return (
            <Box key={id}>
              <GovernanceCommentItem
                name={name}
                message={message}
                postedAt={postedAt}
                avatarUrl={avatarUrl}
              />
              {hasReply &&
                replyComment.map((reply) => {
                  const userReply = users.find((user) => user.id === reply.userId)

                  return (
                    <GovernanceCommentItem
                      key={reply.id}
                      name={userReply?.name || ''}
                      message={reply.message}
                      postedAt={reply.postedAt}
                      avatarUrl={userReply?.avatarUrl || ''}
                      tagUser={reply.tagUser}
                      hasReply
                    />
                  )
                })}
            </Box>
          )
        })}
      </>

      <Pagination count={8} sx={{ my: 5, mx: 'auto' }} />
    </>
  )
}
