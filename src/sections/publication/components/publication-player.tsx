import Box from '@mui/material/Box';
import { FC, memo } from 'react';
import { LoadingScreen } from '../../../components/loading-screen';
import VideoPlayer from '../../../components/video-player';
import { PublicationPlayerProps } from '@src/sections/publication/types.ts';

// ----------------------------------------------------------------------

const PublicationPlayer: FC<PublicationPlayerProps> = (props) =>  {
  const { publication, loading } = props;
  // TODO move to envs..
  const getMediaUri = (cid: string): string => `https://g.watchit.movie/content/${cid}/`;
  const getMovieCid = (): string => publication?.metadata?.asset?.video?.raw?.uri;

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
      {getMovieCid() && (
        <VideoPlayer
          src={getMediaUri(getMovieCid())}
          cid={getMovieCid()}
          titleMovie={publication?.metadata?.title}
          // onBack={handleBack}
        />
      )}
    </Box>
  );
}

export default memo(PublicationPlayer, (prevProps, nextProps) => {
  return prevProps.publication === nextProps.publication;
})
