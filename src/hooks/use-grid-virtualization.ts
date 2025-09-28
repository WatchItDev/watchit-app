import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ExpandedSection, GridDimensions, GridItem } from '@src/sections/explore/types';
import { usePerformanceOptimization } from '@src/hooks/use-performance-optimization.ts';

interface UseGridVirtualizationParams {
  items: GridItem[];
  gridDimensions: GridDimensions;
  expandedSection: ExpandedSection | null;
  expandedExtraOffset: number;
  containerRef: RefObject<HTMLDivElement>;
  overscanRows?: number;
  virtualizationThreshold?: number;
}

interface UseGridVirtualizationResult {
  virtualItems: GridItem[];
  isVirtualized: boolean;
}

/**
 * Calculates which grid items should be mounted based on the current scroll window.
 * Adds a configurable overscan buffer so the user never notices elements popping in.
 */
export const useGridVirtualization = ({
  items,
  gridDimensions,
  expandedSection,
  expandedExtraOffset,
  containerRef,
  overscanRows = 6,
  virtualizationThreshold = 24,
}: UseGridVirtualizationParams): UseGridVirtualizationResult => {
  const { throttle } = usePerformanceOptimization();
  const [viewportHeight, setViewportHeight] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 0));
  const [scrollTop, setScrollTop] = useState<number>(() => (typeof window !== 'undefined' ? window.scrollY : 0));
  const containerOffsetRef = useRef<number>(0);

  const measureContainerOffset = useCallback(() => {
    if (typeof window === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    containerOffsetRef.current = rect.top + window.scrollY;
  }, [containerRef]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      measureContainerOffset();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureContainerOffset]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateScroll = throttle(() => {
      setScrollTop(window.scrollY);
    }, 16);

    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, [throttle]);

  useEffect(() => {
    measureContainerOffset();
  }, [measureContainerOffset, gridDimensions.columns, items.length, expandedExtraOffset]);

  const virtualItems = useMemo(() => {
    if (!gridDimensions.columns || !gridDimensions.itemSize) {
      return items;
    }

    const viewportPx = viewportHeight || 900;
    const rowHeight = gridDimensions.itemSize + gridDimensions.gap;
    const containerOffset = containerOffsetRef.current;
    const expandedId = expandedSection?.itemId;
    const anchorRow = expandedSection?.anchorRow ?? Infinity;

    if (items.length <= virtualizationThreshold || rowHeight <= 0) {
      return items;
    }

    const relativeTop = scrollTop - containerOffset;
    const relativeBottom = relativeTop + viewportPx;

    const startRow = Math.max(0, Math.floor(relativeTop / rowHeight) - overscanRows);
    const endRow = Math.max(
      startRow + overscanRows,
      Math.ceil(relativeBottom / rowHeight) + overscanRows,
    );

    return items.filter((item) => {
      if (item.id === expandedId) return true;

      const itemStartRow = item.position.y;
      const itemEndRow = item.position.y + item.dimensions.height;

      if (expandedSection !== null && itemStartRow >= anchorRow) {
        const offsetRows = Math.ceil(expandedExtraOffset / rowHeight);
        const adjustedStart = itemStartRow + offsetRows;
        const adjustedEnd = itemEndRow + offsetRows;
        return adjustedEnd >= startRow && adjustedStart <= endRow;
      }

      return itemEndRow >= startRow && itemStartRow <= endRow;
    });
  }, [
    items,
    gridDimensions,
    expandedSection,
    expandedExtraOffset,
    overscanRows,
    scrollTop,
    viewportHeight,
    virtualizationThreshold,
  ]);

  return {
    virtualItems,
    isVirtualized: virtualItems.length !== items.length,
  };
};

export default useGridVirtualization;
