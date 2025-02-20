import { FC, useRef, useEffect } from 'react';
import { Typography, IconButton, Button } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  useMediaState,
  isHLSProvider, Track
} from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import Label from '../label';
import { useResponsive } from '@src/hooks/use-responsive';
// @ts-ignore
import '@vidstack/react/player/styles/default/theme.css';
// @ts-ignore
import '@vidstack/react/player/styles/default/layouts/audio.css';
// @ts-ignore
import '@vidstack/react/player/styles/default/layouts/video.css';
import useGetSubtitles from '@src/hooks/use-get-subtitles.ts';

export type VideoPlayerProps = {
  src: string;
  cid: string;
  titleMovie: string;
  onBack?: () => void;
  showBack?: boolean;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, cid, titleMovie, onBack, showBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);
  const { tracks, getSubtitles } = useGetSubtitles();

  useEffect(() => {
    if (cid) getSubtitles(cid);
  }, [cid, getSubtitles]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') onBack?.();
    };

    document?.addEventListener('keydown', handleKeyDown);

    return () => {
      document?.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  useEffect(() => {
    if (player.current) {
      if (isHLSProvider(player.current.provider)) {
        player.current.provider.config = {
          // https://github.com/video-dev/hls.js/blob/master/docs/API.md
          // maxBufferLength defines the target amount of video (in seconds) the player tries to keep buffered.
          // The buffer plays a crucial role in balancing playback stability and adaptive bitrate (ABR) decisions.
          // A larger buffer reduces rebuffering risk but may delay quality switches, while a smaller buffer
          // allows faster adaptation but increases the chance of playback interruptions.
          // Finding the right balance ensures smooth playback without unnecessary network congestion.
          // (hls_time = 6 + maxBufferLength = 30) = 5 fragments in buffer
          "maxBufferLength": 30, // Max video buffer length in seconds
          "maxMaxBufferLength": 600, // Absolute max buffer length
          // maxStarvationDelay defines the maximum acceptable time (in seconds) a fragment can take to download.
          // If a fragment is estimated to take longer than this value, the player switches to a lower quality
          // to prevent buffering. The player selects the best quality that matches this time constraint.
          "maxStarvationDelay": 3,
          // maxLoadingDelay defines the maximum time allowed for initial video loading.
          // - The ABR controller ensures:
          //   - That the time to fetch the first low-quality fragment (420)
          //   - + the time to fetch the optimal-quality fragment is below this value. (720)
          // - If the total time exceeds maxLoadingDelay, the player starts with a lower quality 
          //   to ensure fast playback start.
          "maxLoadingDelay": 4,
          "enableSoftwareAES": false, // Disable software AES decryption
          "enableMetadataCues": false, // Disable metadata cues
          "enableID3MetadataCues": false, // Disable ID3 metadata cues
          "enableWebVTT": true, // Enable WebVTT subtitles
          "enableIMSC1": false, // Disable IMSC1 subtitles
          "enableCEA708Captions": false // Disable CEA-708 captions,
        };
      }
    }
  }, []);

  return (
    <MediaPlayer
      ref={player}
      src={{
        src,
        type: 'application/x-mpegurl',
      }}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      autoPlay
      title={titleMovie}
      style={{ width: '100%', height: '100%' }}
    >
      {showBack && (
        <Button
          onClick={onBack}
          disableFocusRipple
          sx={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: controlsVisible ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#24262A',
            borderRadius: 1.5,
            zIndex: 100,
            m: 1,
            p: 0.2,
            '&:hover': {
              backgroundColor: '#1E1F22',
            },
          }}
        >
          <IconButton disableRipple>
            <IconChevronLeft size={20} />
            <Typography sx={{ ml: 1 }} variant="subtitle2">
              Back
            </Typography>
          </IconButton>
          {mdUp && (
            <Label
              sx={{
                px: 0.75,
                mr: 1,
                fontSize: 12,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            >
              Esc
            </Label>
          )}
        </Button>
      )}
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
      {tracks.map((track) => (
        <Track key={track.src} {...track} />
      ))}
    </MediaPlayer>
  );
};

export default VideoPlayer;
