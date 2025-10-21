import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UsePlayerOverlayArgs {
  postId?: string | number | null;
  onVisibilityChange?: (visible: boolean) => void;
}

interface UsePlayerOverlayResult {
  playerRef: React.MutableRefObject<HTMLDivElement | null>;
  playerHeight: number;
  playerControlsVisible: boolean;
  isInfoExpanded: boolean;
  overlayHovered: boolean;
  setOverlayHovered: (hovered: boolean) => void;
  handleControlsVisibilityChange: (visible: boolean) => void;
  handleToggleInfo: () => void;
}

/** Keeps track of player sizing and overlay visibility state. */
export const usePlayerOverlay = ({
  postId,
  onVisibilityChange,
}: UsePlayerOverlayArgs): UsePlayerOverlayResult => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [playerHeight, setPlayerHeight] = useState(0);
  const [playerControlsVisible, setPlayerControlsVisible] = useState(true);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [overlayHovered, setOverlayHovered] = useState(false);

  useLayoutEffect(() => {
    const node = playerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const nextHeight = entries[0]?.contentRect.height;
      if (Number.isFinite(nextHeight)) setPlayerHeight(Math.round(nextHeight));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsInfoExpanded(false);
  }, [postId]);

  const handleControlsVisibilityChange = useCallback(
    (visible: boolean) => {
      setPlayerControlsVisible(visible);
      onVisibilityChange?.(visible);
    },
    [onVisibilityChange],
  );

  const handleToggleInfo = useCallback(() => {
    setIsInfoExpanded((prev) => !prev);
  }, []);

  return {
    playerRef,
    playerHeight,
    playerControlsVisible,
    isInfoExpanded,
    overlayHovered,
    setOverlayHovered,
    handleControlsVisibilityChange,
    handleToggleInfo,
  };
};
