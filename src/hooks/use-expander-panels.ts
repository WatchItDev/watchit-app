import { useCallback, useEffect, useState } from 'react';
import type { SidePanelKey } from '@src/sections/explore/types';

interface UseExpanderPanelsArgs {
  initialCommentCount: number;
}

interface UseExpanderPanelsResult {
  openPanel: SidePanelKey | null;
  togglePanel: (panel: SidePanelKey) => void;
  closePanel: () => void;
  commentCount: number;
  handleCommentCreated: (shouldIncrement?: boolean) => void;
}

/** Controls the auxiliary panels (comments, bakers, sponsors) state. */
export const useExpanderPanels = ({
  initialCommentCount,
}: UseExpanderPanelsArgs): UseExpanderPanelsResult => {
  const [openPanel, setOpenPanel] = useState<SidePanelKey | null>(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  useEffect(() => {
    setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

  const togglePanel = useCallback((panel: SidePanelKey) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const closePanel = useCallback(() => setOpenPanel(null), []);

  const handleCommentCreated = useCallback((shouldIncrement = true) => {
    if (!shouldIncrement) return;
    setCommentCount((prev) => prev + 1);
  }, []);

  return { openPanel, togglePanel, closePanel, commentCount, handleCommentCreated };
};
