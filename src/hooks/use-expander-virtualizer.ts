import { useCallback } from 'react';
import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import { GRID_CONFIG } from '@src/sections/explore/CONSTANTS';
import { updateExpandedHeight } from '@redux/grid';
import type { AppDispatch } from '@src/redux/store';
import type { AnyRow } from '@src/sections/explore/components/grid/row-types';

interface RuntimeRefs {
  scrollRef: React.RefObject<HTMLDivElement>;
  latestExpanderHeightRef: React.MutableRefObject<number>;
  lastMeasuredRef: React.MutableRefObject<number>;
  expanderRowRef: React.MutableRefObject<HTMLDivElement | null>;
  expanderObserverRef: React.MutableRefObject<ResizeObserver | null>;
  heightUpdateTimeoutRef: React.MutableRefObject<number | null>;
  pendingCenterRef: React.MutableRefObject<boolean>;
}

interface UseExpanderVirtualizerArgs {
  rows: AnyRow[];
  itemSize: number;
  gap: number;
  runtime: RuntimeRefs;
  dispatch: AppDispatch;
}

/**
 * Configures the virtualizer and manages expander measurement updates.
 */
export const useExpanderVirtualizer = ({
  rows,
  itemSize,
  gap,
  runtime,
  dispatch,
}: UseExpanderVirtualizerArgs) => {
  const estimateSize = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row) return GRID_CONFIG.minItemSize + gap;
      if (row.type === 'normal') return itemSize + gap;
      if (row.type === 'slider') return itemSize * 2 + gap * 2;
      return Math.max(runtime.latestExpanderHeightRef.current, 1) + gap;
    },
    [rows, itemSize, gap, runtime.latestExpanderHeightRef],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => runtime.scrollRef.current,
    estimateSize,
    overscan: 8,
    measureElement: (el) => el.getBoundingClientRect().height,
    getItemKey: (index) => rows[index]?.key ?? index,
  });

  const setExpanderNode = useCallback(
    (node: HTMLDivElement | null) => {
      runtime.expanderRowRef.current = node;
      if (runtime.expanderObserverRef.current) {
        runtime.expanderObserverRef.current.disconnect();
        runtime.expanderObserverRef.current = null;
      }
      if (!node) return;
      const observer = new ResizeObserver((entries) => {
        const height = Math.ceil(entries[0]?.contentRect.height ?? node.offsetHeight);
        if (height < 0) return;
        runtime.latestExpanderHeightRef.current = height;
        if (
          Math.abs(height - runtime.lastMeasuredRef.current) > 12 ||
          runtime.lastMeasuredRef.current === 0
        ) {
          runtime.lastMeasuredRef.current = height;
          requestAnimationFrame(() => virtualizer.measureElement(node));
        }
        if (runtime.heightUpdateTimeoutRef.current) {
          window.clearTimeout(runtime.heightUpdateTimeoutRef.current);
        }
        runtime.pendingCenterRef.current = true;
        runtime.heightUpdateTimeoutRef.current = window.setTimeout(() => {
          dispatch(updateExpandedHeight(runtime.latestExpanderHeightRef.current));
          runtime.lastMeasuredRef.current = runtime.latestExpanderHeightRef.current;
          if (runtime.expanderRowRef.current) {
            requestAnimationFrame(() => virtualizer.measureElement(runtime.expanderRowRef.current!));
          }
          runtime.heightUpdateTimeoutRef.current = null;
        }, 120);
      });
      observer.observe(node);
      runtime.expanderObserverRef.current = observer;
    },
    [dispatch, runtime, virtualizer],
  );

  const resetEstimatedHeight = useCallback(() => {
    runtime.latestExpanderHeightRef.current = 0;
    runtime.lastMeasuredRef.current = 0;
  }, [runtime.latestExpanderHeightRef, runtime.lastMeasuredRef]);

  return { virtualizer, setExpanderNode, resetEstimatedHeight };
};
