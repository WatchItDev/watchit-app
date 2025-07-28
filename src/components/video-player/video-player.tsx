import { FC, useRef, useEffect, memo } from 'react';
// @ts-expect-error No error in this context
import { Hls/** , FetchLoader, XhrLoader */} from 'hls.js/dist/hls.mjs';
import { Typography, IconButton, Button } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  useMediaState,
  MediaProviderAdapter,
  isHLSProvider, Track
} from '@vidstack/react';

import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import useGetSubtitles from '@src/hooks/protocol/use-get-subtitles.ts';
import { useResponsive } from '@src/hooks/use-responsive';
import Label from '../label';
import {ErrorData} from "hls.js"
import { useLogEventMutation } from '@src/graphql/generated/hooks.tsx';
import { useAuth } from '@src/hooks/use-auth.ts';

export interface VideoPlayerProps {
  src: string;
  cid: string;
  titleMovie: string;
  onBack?: () => void;
  showBack?: boolean;
  postId: string;
}

const STEP = 5;

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, cid, titleMovie, postId, onBack, showBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);
  const { tracks, getSubtitles } = useGetSubtitles();
  const [logEvent] = useLogEventMutation();
  const { session } = useAuth();

  const watchedSeconds = useRef<Set<number>>(new Set())    // distinct seconds already counted
  const nextEvent  = useRef(5)                         // next percentage to emit (5,10,15…)

  useEffect(() => {
    if (cid) getSubtitles(cid);
  }, [cid]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') onBack?.();
    };

    document?.addEventListener('keydown', handleKeyDown);
    return () => document?.removeEventListener('keydown', handleKeyDown);
  }, []);

  const emit = async (type: string, progress?: number) => {
    if (!session?.authenticated) return;
    try {
      console.log('emit event', type, progress);
      await logEvent({ variables: { input: { type, targetId: postId, targetType: 'POST', progress, meta: { cid } } } });
    } catch (e) {
      console.error('logEvent error', e);
    }
  };

  const handlePlay = () => emit('VIDEO_START');
  const handleEnded = () => emit('VIDEO_WATCH_FULL');

  const handleTimeUpdate = () => {
    const media = player.current
    if (!media?.duration || Number.isNaN(media.duration)) return

    // currentTime is fractional (e.g.3.334s) floor to the integer part so we count each full second only once
    const sec = Math.floor(media.currentTime)

    // if this second was already handled, do nothing (saves work)
    if (watchedSeconds.current.has(sec)) return
    watchedSeconds.current.add(sec)

    // calculate percentage watched based on unique seconds viewed
    const percent = (watchedSeconds.current.size / Math.floor(media.duration)) * 100

    // emit events every 5% (5,10,15…)
    while (percent >= nextEvent.current) {
      emit(`VIDEO_${nextEvent.current}`, nextEvent.current)
      nextEvent.current += STEP
    }
  }

  // on provider (HLS) initialization
  const onProviderSetup = (provider: MediaProviderAdapter) => {
    if (isHLSProvider(provider)) {
      // @ts-expect-error No error in this context
      provider.instance?.on(Hls.Events.ERROR, (_, data: ErrorData) => {
        if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
          console.log("Seek Stalling Detected, Adjusting Buffer...");
          provider.instance?.startLoad();
        }

        if (data.fatal && data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          console.warn("Recovering from Media Error...");
          provider.instance?.recoverMediaError();
        }
      });
    }
  }

  // when the provider has changed, setup config..
  const onProviderChange = (provider: MediaProviderAdapter | null) => {
    if (isHLSProvider(provider)) {
      provider.library = Hls;
      provider.config = {
        "startLevel": -1, // Start at the highest quality level
        "maxBufferLength": 30, // Max video buffer length in seconds
        "backBufferLength": 30,
        "maxBufferHole": 0.5, // Max buffer hole in seconds
        "maxMaxBufferLength": 600, // Absolute max buffer length
        "enableSoftwareAES": false, // Disable software AES decryption
        "enableIMSC1": false, // Disable IMSC1 subtitles
        "enableID3MetadataCues": false, // Disable ID3 metadata cues
        "capLevelToPlayerSize": true,
        "abrMaxWithRealBitrate": true, // Use real bitrate for ABR
        "abrBandWidthFactor": 0.95, // Bandwidth factor for ABR
        "abrBandWidthUpFactor": 0.6,
        "enableWebVTT": true, // Enable WebVTT subtitles
        "enableCEA708Captions": false, // Disable CEA-708 captions,
        "enableWorker": true,
        // "fLoader": FetchLoader,
        // "pLoader": XhrLoader
      };
    }
  }

  return (
    <MediaPlayer
      ref={player}
      src={{ src, type: 'application/x-mpegurl' }}
      onProviderChange={onProviderChange}
      onProviderSetup={onProviderSetup}
      onPlay={handlePlay}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
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

export default memo(VideoPlayer, (prevProps, nextProps) => {
  return prevProps.cid === nextProps.cid;
});
