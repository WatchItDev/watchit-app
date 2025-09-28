import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GRID_CONFIG } from '@src/sections/explore/CONSTANTS';
import type {
  GridItem,
  UseExpandedSectionParams,
  UseExpandedSectionResult,
} from '@src/sections/explore/types';
import { calculateExpandedSectionPosition, getTopOfRow } from '@src/utils/grid';

/**
 * Handles the behaviour of the inline expanded section within the explore grid.
 */
export const useExpandedSection = ({
  harmonizedItems,
  gridDimensions,
  expandedSection,
  setExpandedSection,
  setExpandedOpen,
  updateExpandedY,
}: UseExpandedSectionParams): UseExpandedSectionResult => {
  const pendingOpenRef = useRef<GridItem | null>(null);
  const centerOnceKeyRef = useRef<string | null>(null);

  const openExpandedForItem = useCallback((item: GridItem) => {
    const { anchorRow, y } = calculateExpandedSectionPosition(item, harmonizedItems, gridDimensions);
    setExpandedSection({
      itemId: item.id,
      isOpen: true,
      anchorRow,
      y,
      height: GRID_CONFIG.expandedEstimatedHeight ?? 360,
      content: undefined,
    });
    centerOnceKeyRef.current = null;
  }, [gridDimensions, harmonizedItems, setExpandedSection]);

  const handleItemClick = useCallback((item: GridItem) => {
    if (item.type === 'slider') return;

    if (expandedSection?.itemId === item.id) {
      setExpandedOpen(false);
      pendingOpenRef.current = null;
      return;
    }

    if (expandedSection) {
      pendingOpenRef.current = item;
      setExpandedOpen(false);
      return;
    }

    openExpandedForItem(item);
  }, [expandedSection, openExpandedForItem, setExpandedOpen]);

  useEffect(() => {
    if (!expandedSection) return;
    const y = getTopOfRow(expandedSection.anchorRow, gridDimensions);
    updateExpandedY(y);
  }, [expandedSection, gridDimensions, updateExpandedY]);

  useEffect(() => {
    if (!expandedSection) return;
    if (expandedSection.isOpen) return;

    const id = window.setTimeout(() => {
      const next = pendingOpenRef.current;
      setExpandedSection(null);
      if (next) {
        openExpandedForItem(next);
        pendingOpenRef.current = null;
      }
    }, GRID_CONFIG.animationDuration);

    return () => clearTimeout(id);
  }, [expandedSection?.isOpen, openExpandedForItem, setExpandedSection]);

  useEffect(() => {
    if (!expandedSection?.isOpen) return;
    const key = `${expandedSection.itemId}:${expandedSection.height}`;
    if (centerOnceKeyRef.current === key) return;
    if (expandedSection.height <= 0) return;
    centerOnceKeyRef.current = key;
    const target = expandedSection.y + expandedSection.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [expandedSection?.isOpen, expandedSection?.height, expandedSection?.y, expandedSection?.itemId]);

  const expandedExtraOffset = useMemo(() => (
    expandedSection
      ? Math.max(expandedSection.height, GRID_CONFIG.expandedEstimatedHeight ?? 0) + gridDimensions.gap
      : 0
  ), [expandedSection, gridDimensions.gap]);

  const expandedItem = useMemo(() => (
    expandedSection ? harmonizedItems.find((item) => item.id === expandedSection.itemId) : undefined
  ), [expandedSection, harmonizedItems]);

  return {
    handleItemClick,
    expandedExtraOffset,
    expandedItem,
  };
};
