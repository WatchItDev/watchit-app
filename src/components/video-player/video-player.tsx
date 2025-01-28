import { FC, useRef, useEffect } from 'react';
import { Typography, IconButton, Button } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  useMediaState,
  isHLSProvider,
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

export type VideoPlayerProps = {
  src: string;
  titleMovie: string;
  onBack?: () => void;
  showBack?: boolean;
};

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, titleMovie, onBack, showBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);

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
          debug: false,
          autoStartLoad: true,
          capLevelOnFPSDrop: false,
          capLevelToPlayerSize: false,
          initialLiveManifestSize: 1,

          maxBufferLength: 60,
          maxMaxBufferLength: 600,
          backBufferLength: Infinity,
          frontBufferFlushThreshold: Infinity,
          maxBufferSize: 80 * 1000 * 1000,
          maxBufferHole: 0.2,
          startPosition: -1,
          nudgeOffset: 0.2,
          nudgeMaxRetry: 5,

          liveSyncDurationCount: 3,
          liveSyncOnStallIncrease: 1,
          liveMaxLatencyDurationCount: Infinity,
          liveDurationInfinity: false,
          preferManagedMediaSource: false,
          enableWorker: true,
          enableSoftwareAES: false,
          startFragPrefetch: true,

          testBandwidth: true,
          progressive: false,
          lowLatencyMode: false,

          fpsDroppedMonitoringPeriod: 5000,
          fpsDroppedMonitoringThreshold: 0.2,

          enableDateRangeMetadataCues: false,
          enableMetadataCues: false,
          enableID3MetadataCues: false,
          enableWebVTT: false, // TODO change when subtitles needed
          enableIMSC1: false, // TODO change when subtitles needed
          enableCEA708Captions: false, // TODO change when subtitles needed

          stretchShortVideoTrack: false,
          maxAudioFramesDrift: 1,
          forceKeyFrameOnDiscontinuity: true,

          abrEwmaFastLive: 3.0,
          abrEwmaSlowLive: 9.0,
          abrEwmaFastVoD: 2.0,
          abrEwmaSlowVoD: 6.0,
          abrEwmaDefaultEstimate: 1_000_000,
          abrEwmaDefaultEstimateMax: 10_000_000,
          abrBandWidthFactor: 0.9,
          abrBandWidthUpFactor: 0.75,
          abrMaxWithRealBitrate: true,

          maxStarvationDelay: 3,
          maxLoadingDelay: 3,
          minAutoBitrate: 0,
          emeEnabled: false,
          licenseXhrSetup: undefined,
          drmSystems: {},
          drmSystemOptions: {},
          fragLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 5000,
              maxLoadTimeMs: 60_000,
              timeoutRetry: {
                maxNumRetry: 3,
                retryDelayMs: 1000,
                maxRetryDelayMs: 5000,
              },
              errorRetry: {
                maxNumRetry: 5,
                retryDelayMs: 2000,
                maxRetryDelayMs: 10000,
                backoff: 'exponential',
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
    </MediaPlayer>
  );
};

export default VideoPlayer;
