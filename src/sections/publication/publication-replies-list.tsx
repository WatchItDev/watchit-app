import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { publicationId, useLazyPublications } from '@lens-protocol/react-web';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';

type Props = {
  parentCommentId: string;
  canReply?: boolean;
  refetchTrigger?: number;
};

const RepliesList = ({ parentCommentId, refetchTrigger }: Props) => {
  const { data: replies, error, loading, execute } = useLazyPublications();
  const { hiddenComments } = useSelector((state: any) => state.comments);

  useEffect(() => {
    (async () => {
      const result = await execute({
        where: {
          commentOn: {
            id: publicationId(parentCommentId),
          },
        }
      });

      if (result.isFailure()) {
        console.log('Error trying to get replies');
        return;
      }
    })()
  }, [refetchTrigger]);

  if (loading)
    return (
      <LinearProgress
        color="inherit"
        sx={{
          width: 1,
          maxWidth: 300,
          marginBottom: '16px',
          marginRight: '16px',
          alignSelf: 'flex-end',
        }}
      />
    );

  if (error) return <p>Error loading replies: {error.message}</p>;

  const repliesFiltered = (replies ?? [])
    .filter((comment) => !hiddenComments.some((hiddenComment: any) => hiddenComment.id === comment.id))
    .filter((comment) => !comment.isHidden)

  return (
    <Box sx={{ ml: 0, mb: 1 }}>
      {repliesFiltered?.map((reply: any) => {
        const { id: replyId } = reply;

        return (
          <Box key={replyId} sx={{ mb: 1 }}>
            <PublicationCommentItem
              comment={reply}
              hasReply // Indicate that replies can also have replies
            />
            {/* Render more levels of replies if necessary */}
            {/*<RepliesList parentCommentId={replyId} canReply={canReply} />*/}
          </Box>
        );
      })}
    </Box>
  );
};

export default RepliesList;
