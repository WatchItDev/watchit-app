import { FC, useRef, useEffect, memo } from 'react';
// @ts-expect-error No error in this context
import { Hls, FetchLoader, XhrLoader } from 'hls.js/dist/hls.mjs';
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

const MAX_CONTIGUOUS_GAP = 2;
const STEP                = 5;

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, cid, titleMovie, postId, onBack, showBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);
  const { tracks, getSubtitles } = useGetSubtitles();
  const [logEvent] = useLogEventMutation();
  const { session } = useAuth();

  const sentMarks  = useRef<Set<number>>(new Set());
  const lastPos    = useRef<number>(0);
  const watchedSec = useRef<number>(0);
  const started    = useRef<boolean>(false);

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
    console.log('emit event', type, progress);
    if (!session?.authenticated) return;
    try {
      await logEvent({
        variables: {
          input: {
            type,
            targetId: postId,
            targetType: 'POST',
            progress,
            meta: { cid },
          },
        },
      });
    } catch (e) {
      console.error('logEvent error', e);
    }
  };

  const handlePlay = () => { if (!started.current) { emit('VIDEO_START'); started.current = true; } };

  const handleTimeUpdate = () => {
    const m = player.current;
    if (!m?.duration) return;

    const diff = m.currentTime - lastPos.current;
    lastPos.current = m.currentTime;

    if (diff > 0 && diff <= MAX_CONTIGUOUS_GAP) watchedSec.current += diff;

    const pct = (watchedSec.current / m.duration) * 100;
    const nextMark = Math.floor(pct / STEP) * STEP;

    if (nextMark > 0 && !sentMarks.current.has(nextMark)) {
      emit(`VIDEO_${nextMark}`, nextMark);
      sentMarks.current.add(nextMark);
    }
  };

  const handleEnded = () => emit('VIDEO_WATCH_FULL');

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
        "maxBufferLength": 60, // Max video buffer length in seconds
        "maxMaxBufferLength": 600, // Absolute max buffer length
        "enableSoftwareAES": false, // Disable software AES decryption
        "enableID3MetadataCues": false, // Disable ID3 metadata cues
        "enableWebVTT": true, // Enable WebVTT subtitles
        "enableIMSC1": false, // Disable IMSC1 subtitles
        "enableCEA708Captions": false, // Disable CEA-708 captions,
        "enableWorker": true,
        "backBufferLength": 90,
        "fLoader": FetchLoader,
        "pLoader": XhrLoader
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
