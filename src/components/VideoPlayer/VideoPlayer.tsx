import React, { FC, useRef, useEffect } from 'react';
import { Typography, IconButton, Button } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Poster,
  Track,
  useMediaState,
} from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import Label from '../label';
import { useResponsive } from '../../hooks/use-responsive';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export type VideoPlayerProps = {
  src: string;
  titleMovie: string;
  preview?: boolean;
  onBack?: () => void;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, titleMovie, preview, onBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') onBack?.();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  return (
    <MediaPlayer
      src={src}
      ref={player}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      autoPlay
      title={titleMovie}
      style={{ width: '100%', height: '100%' }}
    >
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
      <MediaProvider>
        {/* <Poster className="vds-poster" /> */}
        {/* {textTracks.map(track => (
          <Track {...track} key={track.src} />
        ))} */}
      </MediaProvider>
      <DefaultVideoLayout
        // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
};

export default VideoPlayer;
