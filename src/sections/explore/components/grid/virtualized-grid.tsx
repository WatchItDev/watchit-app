import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@src/redux/store';
import { ScrollParent, RowsInner } from './grid-layout-primitives';
import { SkeletonGrid } from './skeleton-grid';
import { VirtualizedRows } from './virtualized-grid-rows';
import { GRID_CONFIG } from '../../CONSTANTS';
import { useExpanderRuntime } from '@src/hooks/use-expander-runtime';
import { useGridDimensions } from '@src/hooks/use-grid-dimensions';
import { useVirtualRowsData } from '@src/hooks/use-virtual-rows-data';
import { useExpanderVirtualizer } from '@src/hooks/use-expander-virtualizer';
import { useExpanderScrollSync } from '@src/hooks/use-expander-scroll-sync';
import { useExpanderActions } from '@src/hooks/use-expander-actions';
import { useExpanderCleanup } from '@src/hooks/use-expander-cleanup';
import { estimateExpanderHeight } from '@src/utils/explore-grid-expander';
import { updateExpandedHeight } from '@redux/grid';

type Props = { sentinelRef?: React.RefObject<HTMLDivElement> };

const VirtualizedGrid = memo(({ sentinelRef }: Props) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.grid.items);
  const expandedSection = useSelector((state: RootState) => state.grid.expandedSection);
  const hasUserScrolledAfterExpand = useSelector((state: RootState) => state.grid.hasUserScrolledAfterExpand);

  const runtime = useExpanderRuntime();

  useEffect(() => {
    runtime.expandedSectionRef.current = expandedSection;
  }, [expandedSection, runtime.expandedSectionRef]);

  const { columns, itemSize, gap, gridWidth, containerWidthRef } = useGridDimensions({
    scrollRef: runtime.scrollRef,
    config: GRID_CONFIG,
  });

  const { rows, itemRowIndex } = useVirtualRowsData(items, columns, expandedSection);

  const { virtualizer, setExpanderNode, resetEstimatedHeight } = useExpanderVirtualizer({
    rows,
    itemSize,
    gap,
    runtime,
    dispatch,
  });

  useExpanderScrollSync({
    expandedSection,
    hasUserScrolledAfterExpand,
    dispatch,
    runtime,
    virtualizer,
    rows,
  });

  const { handleItemClick, handleSliderPostSelect, handleCloseExpanded } = useExpanderActions({
    itemRowIndex,
    expandedSection,
    gap,
    gridWidth,
    dispatch,
    resetEstimatedHeight,
    runtime: {
      cleanupTimeoutRef: runtime.cleanupTimeoutRef,
      expandedSectionRef: runtime.expandedSectionRef,
      latestExpanderHeightRef: runtime.latestExpanderHeightRef,
      lastMeasuredRef: runtime.lastMeasuredRef,
      containerWidthRef,
      pendingCenterRef: runtime.pendingCenterRef,
    },
  });

  useExpanderCleanup({
    expanderObserverRef: runtime.expanderObserverRef,
    cleanupTimeoutRef: runtime.cleanupTimeoutRef,
    scrollDelayRef: runtime.scrollDelayRef,
    heightUpdateTimeoutRef: runtime.heightUpdateTimeoutRef,
  });

  useEffect(() => {
    if (!expandedSection?.isOpen) return;
    const expandedItem = items.find((item) => item.id === expandedSection.itemId);
    if (!expandedItem) return;
    const width = gridWidth || containerWidthRef.current;
    const predictedHeight = estimateExpanderHeight(width, gap, GRID_CONFIG);
    runtime.latestExpanderHeightRef.current = predictedHeight;
    runtime.lastMeasuredRef.current = predictedHeight;
    dispatch(updateExpandedHeight(predictedHeight));
    if (runtime.expanderRowRef.current) {
      requestAnimationFrame(() => virtualizer.measureElement(runtime.expanderRowRef.current!));
    }
  }, [
    dispatch,
    expandedSection?.isOpen,
    expandedSection?.itemId,
    gap,
    gridWidth,
    items,
    containerWidthRef,
    runtime.latestExpanderHeightRef,
    runtime.lastMeasuredRef,
    runtime.expanderRowRef,
    virtualizer,
  ]);

  const shouldShowSkeleton = rows.length === 0;

  return (
    <ScrollParent ref={runtime.scrollRef}>
      <RowsInner style={{ height: virtualizer.getTotalSize() }}>
        {shouldShowSkeleton ? (
          <SkeletonGrid columns={columns} itemSize={itemSize} gap={gap} />
        ) : (
          <VirtualizedRows
            rows={rows}
            virtualizer={virtualizer}
            columns={columns}
            itemSize={itemSize}
            gap={gap}
            expandedSection={expandedSection}
            hasUserScrolledAfterExpand={hasUserScrolledAfterExpand}
            items={items}
            setExpanderNode={setExpanderNode}
            onGridItemClick={handleItemClick}
            onSliderPostSelect={handleSliderPostSelect}
            onCloseExpanded={handleCloseExpanded}
            animationDuration={GRID_CONFIG.animationDuration}
            sentinelRef={sentinelRef}
          />
        )}
      </RowsInner>
    </ScrollParent>
  );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';
export default VirtualizedGrid;
