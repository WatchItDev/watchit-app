import { useCallback } from 'react';
import {
  setExpandedOpen,
  setExpandedSection,
  setHasUserScrolledAfterExpand,
} from '@redux/grid';
import { estimateExpanderHeight } from '@src/utils/explore-grid-expander';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '@src/sections/explore/types';
import type { AppDispatch } from '@src/redux/store';
import type { Post } from '@src/graphql/generated/graphql';
import { GRID_CONFIG } from '@src/sections/explore/CONSTANTS';

interface RuntimeRefs {
  cleanupTimeoutRef: React.MutableRefObject<number | null>;
  expandedSectionRef: React.MutableRefObject<ExpandedSectionType | null>;
  latestExpanderHeightRef: React.MutableRefObject<number>;
  lastMeasuredRef: React.MutableRefObject<number>;
  containerWidthRef: React.MutableRefObject<number>;
  pendingCenterRef: React.MutableRefObject<boolean>;
}

interface UseExpanderActionsArgs {
  itemRowIndex: Map<string, number>;
  expandedSection: ExpandedSectionType | null;
  gap: number;
  gridWidth: number;
  dispatch: AppDispatch;
  resetEstimatedHeight: () => void;
  runtime: RuntimeRefs;
}

/**
 * Provides the callbacks responsible for opening and closing the inline expander.
 */
export const useExpanderActions = ({
  itemRowIndex,
  expandedSection,
  gap,
  gridWidth,
  dispatch,
  resetEstimatedHeight,
  runtime,
}: UseExpanderActionsArgs) => {
  const openExpandedForItem = useCallback(
    (item: GridItemType, selectedPost?: Post | null) => {
      const rowIdx = itemRowIndex.get(item.id);
      if (rowIdx == null) return;
      const width = gridWidth || runtime.containerWidthRef.current;
      const predictedHeight = estimateExpanderHeight(width, gap, GRID_CONFIG);
      runtime.latestExpanderHeightRef.current = predictedHeight;
      runtime.lastMeasuredRef.current = predictedHeight;
      dispatch(
        setExpandedSection({
          itemId: item.id,
          isOpen: true,
          anchorRow: rowIdx,
          y: 0,
          height: predictedHeight,
          selectedPost: selectedPost ?? (item.data?.post as Post | undefined) ?? null,
        }),
      );
      dispatch(setHasUserScrolledAfterExpand(false));
    },
    [dispatch, gap, gridWidth, itemRowIndex, runtime.containerWidthRef, runtime.lastMeasuredRef, runtime.latestExpanderHeightRef, runtime.pendingCenterRef],
  );

  const scheduleCleanup = useCallback(
    (itemId: string) => {
      if (runtime.cleanupTimeoutRef.current) window.clearTimeout(runtime.cleanupTimeoutRef.current);
      runtime.cleanupTimeoutRef.current = window.setTimeout(() => {
        const current = runtime.expandedSectionRef.current;
        if (current && current.itemId === itemId && !current.isOpen) {
          dispatch(setExpandedSection(null));
        }
        runtime.cleanupTimeoutRef.current = null;
      }, GRID_CONFIG.animationDuration);
    },
    [dispatch, runtime.cleanupTimeoutRef, runtime.expandedSectionRef],
  );

  const handleItemClick = useCallback(
    (item: GridItemType) => {
      if (expandedSection?.itemId === item.id) {
        resetEstimatedHeight();
        dispatch(setExpandedOpen(false));
        scheduleCleanup(item.id);
        runtime.pendingCenterRef.current = false;
        dispatch(setExpandedSection(null));
        return;
      }
      if (runtime.cleanupTimeoutRef.current) {
        window.clearTimeout(runtime.cleanupTimeoutRef.current);
        runtime.cleanupTimeoutRef.current = null;
      }
      const post = item.data?.post as Post | undefined;
      resetEstimatedHeight();
      openExpandedForItem(item, post);
    },
    [dispatch, expandedSection, openExpandedForItem, resetEstimatedHeight, runtime.cleanupTimeoutRef, runtime.pendingCenterRef, scheduleCleanup],
  );

  const handleSliderPostSelect = useCallback(
    (sliderItem: GridItemType, post: Post | null | undefined) => {
      if (!post) return;
      if (runtime.cleanupTimeoutRef.current) {
        window.clearTimeout(runtime.cleanupTimeoutRef.current);
        runtime.cleanupTimeoutRef.current = null;
      }
      resetEstimatedHeight();
      openExpandedForItem(sliderItem, post);
    },
    [openExpandedForItem, resetEstimatedHeight, runtime.cleanupTimeoutRef],
  );

  const handleCloseExpanded = useCallback(() => {
    if (!expandedSection) return;
    resetEstimatedHeight();
    dispatch(setExpandedOpen(false));
    scheduleCleanup(expandedSection.itemId);
    dispatch(setExpandedSection(null));
    runtime.pendingCenterRef.current = false;
  }, [dispatch, expandedSection, resetEstimatedHeight, scheduleCleanup, runtime.pendingCenterRef]);

  return {
    handleItemClick,
    handleSliderPostSelect,
    handleCloseExpanded,
    scheduleCleanup,
    openExpandedForItem,
  };
};
