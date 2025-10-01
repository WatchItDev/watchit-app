import Box from '@mui/material/Box';
import { FC, memo } from 'react';
import { LoadingScreen } from '@src/components/loading-screen';
import VideoPlayer from '@src/components/video-player';
import { PublicationPlayerProps } from '@src/sections/publication/types.ts';
import { getMediaUri, getMovieCid } from '@src/utils/publication.ts';

// ----------------------------------------------------------------------

const PublicationPlayer: FC<PublicationPlayerProps> = (props) => {
  const { publication, loading, onPlay, onControlsVisibilityChange } = props;

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {getMovieCid(publication) && (
        <VideoPlayer
          src={getMediaUri(getMovieCid(publication))}
          cid={getMovieCid(publication)}
          titleMovie={publication?.title ?? ''}
          postId={publication?.id}
          onPlay={onPlay}
          onControlsVisibilityChange={onControlsVisibilityChange}
          // onBack={handleBack}
        />
      )}
    </Box>
  );
};

export default memo(PublicationPlayer, (prevProps, nextProps) => {
  return prevProps.publication === nextProps.publication;
});
