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

  const movieCid = getMovieCid(publication);
  const media = (publication as any)?.media ?? [];
  const videoAttachment =
    media.find((item: any) => item?.type?.toLowerCase() === 'video') ??
    media.find((item: any) => item?.type?.toLowerCase() === 'application/vnd.apple.mpegurl') ??
    media.find((item: any) => item?.title?.toLowerCase().includes('video')) ??
    null;

  const attachmentUrl = videoAttachment?.url ?? '';
  const normalizedAttachmentUrl = attachmentUrl.endsWith('/')
    ? `${attachmentUrl}index.m3u8`
    : attachmentUrl;
  const videoSrc = normalizedAttachmentUrl || (movieCid ? getMediaUri(movieCid) : '');
  const playerCid = movieCid || videoAttachment?.cid || '';

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {videoSrc && (
        <VideoPlayer
          src={videoSrc}
          cid={playerCid}
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
