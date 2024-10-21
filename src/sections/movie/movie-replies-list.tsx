import React from 'react';
import Box from '@mui/material/Box';
import { usePublications, publicationId } from '@lens-protocol/react-web';
import MovieCommentItem from './movie-comment-item';

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

  if (loading) return <p>Loading replies...</p>;
  if (error) return <p>Error loading replies: {error.message}</p>;

  return (
    <Box sx={{ pl: 4, mt: 2 }}>
      {replies?.map((reply: any) => {
        const { id: replyId, metadata, createdAt, by } = reply;

        return (
          <Box key={replyId}>
            <MovieCommentItem
              profileName={by?.handle?.localName}
              profileId={by?.id}
              message={metadata?.content}
              postedAt={new Date(createdAt)}
              commentId={replyId}
              hasReply // Indicate that replies can also have replies
            />
            {/* Render more levels of replies if necessary */}
            <RepliesList parentCommentId={replyId} canReply={canReply} />
          </Box>
        );
      })}
    </Box>
  );
};

export default RepliesList;
