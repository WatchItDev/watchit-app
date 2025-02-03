import { useCallback, useState } from 'react';
import useMetadata from '@src/hooks/use-metadata';

/**
 * Represents a subtitle track configuration for media players.
 */
export interface SubtitleTrack {
  src: string;
  label: string;
  language: string;
  kind: 'subtitles';
  default: boolean;
}

/**
 * Return type of the useGetSubtitles hook
 */
export interface UseGetSubtitlesReturn {
  /** Array of formatted subtitle tracks */
  tracks: SubtitleTrack[];
  /** Loading state indicator */
  loading: boolean;
  /** Function to fetch subtitles by CID */
  getSubtitles: (cid: string) => Promise<SubtitleTrack[]>;
}

/**
 * Maps common language names to standard language codes
 */
const getLanguageCode = (label: string): string => {
  const normalized = label.trim().toLowerCase();
  switch (normalized) {
    case 'english':
      return 'en-US';
    case 'spanish':
      return 'es-ES';
    case 'french':
      return 'fr-FR';
    case 'german':
      return 'de-DE';
    case 'portuguese':
      return 'pt-BR';
    default:
      return 'en-US'; // Fallback to English
  }
};

/**
 * Custom hook to fetch and format subtitle tracks for media players
 */
const useGetSubtitles = (): UseGetSubtitlesReturn => {
  const { getMetadata } = useMetadata();
  const [tracks, setTracks] = useState<SubtitleTrack[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches and processes subtitles for a given CID
   * @param cid Content identifier for the media
   * @returns Formatted subtitle tracks
   */
  const getSubtitles = useCallback(async (cid: string): Promise<SubtitleTrack[]> => {
    setLoading(true);
    try {
      const metadata = await getMetadata(cid);
      const subtitleAttachments = metadata.Data.attachments.filter(
        (attachment) => attachment.type === 'text/vtt'
      );

      let hasDefault = false;
      const processedTracks = subtitleAttachments.map((attachment) => {
        const isEnglish = attachment.title.toLowerCase() === 'english';
        const language = getLanguageCode(attachment.title);

        const track: SubtitleTrack = {
          src: `https://g.watchit.movie/content/${attachment.cid}/`,
          label: attachment.title,
          language,
          kind: 'subtitles',
          default: !hasDefault && isEnglish
        };

        if (track.default) hasDefault = true;
        return track;
      });

      // Fallback to first track if no English found
      if (!hasDefault && processedTracks.length > 0) {
        processedTracks[0].default = true;
      }

      setTracks(processedTracks);
      return processedTracks;
    } catch (error) {
      setTracks([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMetadata]);

  return { tracks, loading, getSubtitles };
};

export default useGetSubtitles;
