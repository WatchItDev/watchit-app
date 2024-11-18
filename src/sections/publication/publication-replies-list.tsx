import React from 'react';
import Box from '@mui/material/Box';
import { usePublications, publicationId } from '@lens-protocol/react-web';
import PublicationCommentItem from './publication-comment-item.tsx';
import LinearProgress from '@mui/material/LinearProgress';

type Props = {
  parentCommentId: string;
  canReply?: boolean
};

const RepliesList = ({ parentCommentId, canReply }: Props) => {
  const { data: replies, loading, error } = usePublications({
    where: {
      commentOn: {
        id: publicationId(parentCommentId),
      },
    },
  });

  if (loading) return <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 300, marginBottom: '16px', marginRight: '16px', alignSelf: 'flex-end' }} />;
  if (error) return <p>Error loading replies: {error.message}</p>;

  return (
    <Box sx={{ ml: 0, mb: 1 }}>
      {replies?.map((reply: any) => {
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