import Box from '@mui/material/Box';
import { FC, memo } from 'react';
import { LoadingScreen } from '@src/components/loading-screen';
import VideoPlayer from '@src/components/video-player';
import { PublicationPlayerProps } from '@src/sections/publication/types.ts';
import { getMediaUri, getMovieCid } from '@src/utils/publication.ts';

// ----------------------------------------------------------------------

const PublicationPlayer: FC<PublicationPlayerProps> = (props) =>  {
  const { publication, loading } = props;

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {getMovieCid(publication) && (
        <VideoPlayer
          src={getMediaUri(getMovieCid(publication))}
          cid={getMovieCid(publication)}
          title={publication?.title}
          postId={publication?.id}
          // onBack={handleBack}
        />
      )}
    </Box>
  );
}

export default memo(PublicationPlayer, (prevProps, nextProps) => {
  return prevProps.publication === nextProps.publication;
})
