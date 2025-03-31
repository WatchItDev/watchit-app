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

export interface VideoPlayerProps {
  src: string;
  cid: string;
  titleMovie: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ src, cid, titleMovie, onBack, showBack }) => {
  const mdUp = useResponsive('up', 'md');
  const player = useRef<MediaPlayerInstance>(null);
  const controlsVisible = useMediaState('controlsVisible', player);
  const { tracks, getSubtitles } = useGetSubtitles();

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
        // "capLevelToPlayerSize": true, // avoid more resolution if doest not fit in the current viewport
        // https://github.com/video-dev/hls.js/blob/master/docs/API.md
        // maxBufferLength defines the target amount of video (in seconds) the player tries to keep buffered.
        // The buffer plays a crucial role in balancing playback stability and adaptive bitrate (ABR) decisions.
        // A larger buffer reduces rebuffering risk but may delay quality switches, while a smaller buffer
        // allows faster adaptation but increases the chance of playback interruptions.
        // Finding the right balance ensures smooth playback without unnecessary network congestion.
        // (hls_time = 6 + maxBufferLength = 30) = 5 fragments in buffer
        // "maxBufferLength": 60, // Max video buffer length in seconds
        // "maxMaxBufferLength": 600, // Absolute max buffer length
        // maxStarvationDelay defines the maximum acceptable time (in seconds) a fragment can take to download
        // while playback is already in progress.
        // - If a fragment is estimated to take longer than this value and the buffer is running low,
        //   the player switches the best quality that matches this time constraint.
        // - This ensures a continuous playback experience by adapting the quality to network conditions in real-time.
        // "maxStarvationDelay": 4,
        // maxLoadingDelay defines the maximum allowed time (in seconds) to load the initial fragments when starting playback.
        // - The ABR controller ensures:
        //   - The time to fetch the first low-quality fragment (e.g., 420p)
        //   - + The time to fetch the estimated optimal-quality fragment (e.g., 720p)
        //   - is below this value.
        // - If the total loading time exceeds maxLoadingDelay, the player starts with a lower quality
        //   to minimize startup delay and ensure fast playback.
        // - Unlike maxStarvationDelay, this setting only applies at the **start** of playback,
        //   ensuring the video loads quickly even if it means initially using a lower quality.
        // "maxLoadingDelay": 4,
        // abrEwmaFastVod: Controls how quickly the algorithm reacts to bandwidth changes in VOD (Video On Demand).
        // A higher value makes the algorithm less sensitive to short-term fluctuations, smoothing out rapid changes.
        // Recommended range: 2.0 - 5.0 (Higher = Smoother)
        // "abrEwmaFastVoD": 3,
        // abrEwmaSlowVod: Controls the long-term average bandwidth estimation for adaptive bitrate switching.
        // A higher value averages the bandwidth over a longer period, reducing frequent quality switches.
        // Recommended range: 10.0 - 20.0 (Higher = More stable, but slower adaptation)
        // "abrEwmaSlowVoD": 8,
        // abrBandWidthFactor: Determines how conservatively HLS estimates available bandwidth.
        // A value < 1.0 ensures HLS.js does not use the full estimated bandwidth, preventing aggressive quality changes.
        // Recommended range: 0.7 - 0.9 (Lower = More cautious, fewer quality switches)
        // "abrBandWidthFactor": 0.9,
        // abrBandWidthUpFactor: Controls how aggressively the player upgrades to a higher bitrate.
        // A lower value prevents HLS.js from switching to a higher quality too quickly, reducing unnecessary upscaling.
        // Recommended range: 0.5 - 0.8 (Lower = More stable, avoids excessive upscaling)
        // "abrBandWidthUpFactor": 0.7,
        "enableSoftwareAES": false, // Disable software AES decryption
        "enableID3MetadataCues": false, // Disable ID3 metadata cues
        "enableWebVTT": true, // Enable WebVTT subtitles
        "enableIMSC1": false, // Disable IMSC1 subtitles
        "enableCEA708Captions": false, // Disable CEA-708 captions,
        "enableWorker": true,
        "backBufferLength": 90,
        "lowLatencyMode": false, // Not needed in VOD
        // "startFragPrefetch": true,
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
