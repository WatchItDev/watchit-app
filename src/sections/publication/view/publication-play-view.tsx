import Box from '@mui/material/Box';
import { memo } from 'react';
import { LoadingScreen } from '../../../components/loading-screen';
import VideoPlayer from '../../../components/video-player';

// ----------------------------------------------------------------------
interface Props {
  publication: any;
  loading: boolean;
}

// ----------------------------------------------------------------------

export default memo(function PublicationPlayView({ publication, loading }: Props) {
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
}, (prevProps, nextProps) => {
  return prevProps.publication === nextProps.publication;
})
