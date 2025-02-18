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
          debug: false, // Disable debug logs
          autoStartLoad: true, // Start loading video automatically
          initialLiveManifestSize: 3, // Initial fragment size for playback

          maxBufferLength: 60, // Max video buffer length in seconds
          maxMaxBufferLength: 120, // Absolute max buffer length
          // backBufferLength: 15, // Keep 15s of past video in buffer
          // frontBufferFlushThreshold: 30, // Flush buffer if ahead of 30s
          // maxBufferSize: 20 * 1000 * 1000, // Max buffer size in bytes (20MB)
          maxBufferHole: 0.2, // Allowed gap between buffered segments
          startPosition: -1, // Start at the beginning if -1
          nudgeOffset: 0.2, // Small seek adjustment for stalled playback
          nudgeMaxRetry: 5, // Max retries to nudge playback

          preferManagedMediaSource: true, // Prefer MSE for playback
          enableWorker: true, // Use web worker for processing
          enableSoftwareAES: false, // Disable software AES decryption
          startFragPrefetch: true, // Preload next fragment before needed

          testBandwidth: true, // Measure bandwidth for adaptive streaming
          progressive: false, // Do not enable progressive loading
          lowLatencyMode: false, // Disable low latency mode for VOD

          fpsDroppedMonitoringPeriod: 3000, // Monitor FPS drops every 3s
          fpsDroppedMonitoringThreshold: 0.1, // Allow 10% FPS drop before action

          enableDateRangeMetadataCues: false, // Disable metadata cues
          enableMetadataCues: false, // Disable metadata cues
          enableID3MetadataCues: false, // Disable ID3 metadata cues
          enableWebVTT: true, // Enable WebVTT subtitles
          enableIMSC1: false, // Disable IMSC1 subtitles
          enableCEA708Captions: false, // Disable CEA-708 captions

          stretchShortVideoTrack: false, // Do not stretch short video tracks
          maxAudioFramesDrift: 0.5, // Allow small drift in audio sync
          forceKeyFrameOnDiscontinuity: true, // Ensure keyframe on segment change

          abrEwmaFastVoD: 2.0, // Fast averaging window for ABR
          abrEwmaSlowVoD: 6.0, // Slow averaging window for ABR
          abrEwmaDefaultEstimate: 2_000_000, // Default bandwidth estimate (bps)
          abrEwmaDefaultEstimateMax: 8_000_000, // Max default estimate (bps)
          abrBandWidthFactor: 0.9, // Factor applied to bandwidth estimation
          abrBandWidthUpFactor: 0.8, // Factor applied when increasing bitrate
          abrMaxWithRealBitrate: true, // Use real bitrate for ABR decisions

          maxStarvationDelay: 3, // Max delay before switching down quality
          maxLoadingDelay: 3, // Max delay before switching down quality
          minAutoBitrate: 500_000, // Minimum auto bitrate (500kbps)
          emeEnabled: false, // Disable DRM by default
          licenseXhrSetup: undefined, // No custom DRM license handling
          drmSystems: {}, // No DRM systems configured
          drmSystemOptions: {}, // No DRM options specified

          fragLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 3000, // Max time to receive first byte
              maxLoadTimeMs: 30_000, // Max fragment load time
              timeoutRetry: {
                maxNumRetry: 3, // Max retries for timeout
                retryDelayMs: 500, // Initial retry delay
                maxRetryDelayMs: 3000, // Max retry delay
              },
              errorRetry: {
                maxNumRetry: 4, // Max retries for errors
                retryDelayMs: 1000, // Initial retry delay
                maxRetryDelayMs: 5000, // Max retry delay
                backoff: 'exponential', // Exponential backoff strategy
              },
            },
          },
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
