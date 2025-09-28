import React, { memo, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import type { Post } from '@src/graphql/generated/graphql';
import {
  EXPLORE_SLIDERS,
  GRID_CONFIG,
} from '@src/sections/explore/CONSTANTS';
import type { ExploreGridPresenterProps } from '@src/sections/explore/types';
import ExploreGridItem from './explore-grid-item';
import ExploreGridInlineExpander from './explore-grid-inline-expander';
import ExploreGridSliderItem from './explore-grid-slider-item';
import { GridContainer, GridWrapper, LoadingIndicator } from './explore-grid-styles';
import ExploreGridSkeleton from './explore-grid-skeleton';
import { useGridResize } from '@src/hooks/use-grid-resize';
import { useGridLayout } from '@src/hooks/use-grid-layout';
import { useGridTransitions } from '@src/hooks/use-grid-transitions';
import { useExpandedSection } from '@src/hooks/use-expanded-section';
import { useGridScrollSync } from '@src/hooks/use-grid-scroll-sync';
import useGridVirtualization from '@src/hooks/use-grid-virtualization';
import { calculateBaseTotalHeight, calculateFeedHeight } from '@src/utils/grid';

/**
 * Presentation component that renders the responsive explore feed grid.
 */

const ExploreGridPresenter: React.FC<ExploreGridPresenterProps> = ({
  items,
  expandedSection,
  gridDimensions,
  actions,
  externalLoading = false,
  sentinelRef,
}) => {
  const {
    setGridDimensions,
    setExpandedSection,
    setExpandedOpen,
    updateExpandedHeight,
    updateExpandedY,
    setScrollPosition,
    setIsScrolling,
  } = actions;

  const { gridContainerRef, gridWrapperRef } = useGridResize(setGridDimensions);
  const { harmonizedItems, rowHeights } = useGridLayout(items, gridDimensions);
  const transitionsEnabled = useGridTransitions(gridDimensions.columns, harmonizedItems.length);

  const sliderLookup = useMemo(
    () => new Map(EXPLORE_SLIDERS.map((slider) => [`slider-${slider.id}`, slider])),
    [],
  );

  const { handleItemClick, expandedExtraOffset, expandedItem } = useExpandedSection({
    harmonizedItems,
    gridDimensions,
    expandedSection,
    setExpandedSection,
    setExpandedOpen,
    updateExpandedY,
  });

  const { virtualItems } = useGridVirtualization({
    items: harmonizedItems,
    gridDimensions,
    expandedSection,
    expandedExtraOffset,
    containerRef: gridWrapperRef,
    overscanRows: 4,
    virtualizationThreshold: 18,
  });

  useGridScrollSync({ setScrollPosition, setIsScrolling });

  const baseTotalGridHeight = useMemo(
    () => calculateBaseTotalHeight(rowHeights, gridDimensions),
    [rowHeights, gridDimensions],
  );

  const feedHeight = useMemo(
    () => calculateFeedHeight(harmonizedItems, gridDimensions),
    [harmonizedItems, gridDimensions],
  );

  const isItemDimmed = useCallback((_id: string) => false, []);

  const gridItems = useMemo(() => (
    virtualItems.map((item) => {
      if (item.type === 'slider') {
        return (
          <ExploreGridSliderItem
            key={item.id}
            item={item}
            sliderMeta={sliderLookup.get(item.id)}
            gridDimensions={gridDimensions}
            expandedSection={expandedSection}
            expandedExtraOffset={expandedExtraOffset}
            transitionsEnabled={transitionsEnabled}
          />
        );
      }

      return (
        <ExploreGridItem
          key={item.id}
          item={item}
          gridDimensions={gridDimensions}
          rowHeights={rowHeights}
          isExpanded={!!(expandedSection && expandedSection.itemId === item.id)}
          isDimmed={isItemDimmed(item.id)}
          onItemClick={handleItemClick}
          animationMs={GRID_CONFIG.animationDuration}
          anchorRowForOffset={expandedSection ? expandedSection.anchorRow : null}
          expandedOffset={expandedExtraOffset}
          transitionsEnabled={transitionsEnabled}
        />
      );
    })
  ), [
    expandedExtraOffset,
    expandedSection,
    gridDimensions,
    handleItemClick,
    isItemDimmed,
    rowHeights,
    sliderLookup,
    transitionsEnabled,
    virtualItems,
  ]);

  const expandedInlineRow = useMemo(() => {
    if (!expandedSection || !expandedItem) return null;
    const post = expandedItem.data?.post as Post | undefined;

    return (
      <ExploreGridInlineExpander
        top={expandedSection.y}
        open={expandedSection.isOpen}
        animationMs={GRID_CONFIG.animationDuration}
        onMeasured={(height) => updateExpandedHeight(height)}
        post={post}
      />
    );
  }, [expandedItem, expandedSection, updateExpandedHeight]);

  if (!gridDimensions.columns) {
    return (
      <GridContainer ref={gridContainerRef}>
        <LoadingIndicator>Cargando grid...</LoadingIndicator>
      </GridContainer>
    );
  }

  const baseHeight = baseTotalGridHeight + expandedExtraOffset;
  const skeletonHeight = 6 * gridDimensions.itemSize + 7 * gridDimensions.gap;
  const shouldShowInitialSkeleton = harmonizedItems.length === 0 && externalLoading;

  return (
    <GridContainer ref={gridContainerRef}>
      <GridWrapper ref={gridWrapperRef} style={{ height: shouldShowInitialSkeleton ? skeletonHeight : baseHeight }}>
        {shouldShowInitialSkeleton ? (
          <ExploreGridSkeleton
            columns={gridDimensions.columns}
            itemSize={gridDimensions.itemSize}
            gap={gridDimensions.gap}
            rows={6}
          />
        ) : (
          <>
            {gridItems}
            {expandedInlineRow}

            {sentinelRef && (
              <Box
                ref={sentinelRef}
                sx={{
                  position: 'absolute',
                  left: gridDimensions.gap,
                  right: gridDimensions.gap,
                  top: Math.max(feedHeight - gridDimensions.itemSize, gridDimensions.gap),
                  height: 1,
                }}
              />
            )}
          </>
        )}
      </GridWrapper>

      {externalLoading && harmonizedItems.length > 0 && (
        <LoadingIndicator>Loading more items...</LoadingIndicator>
      )}
    </GridContainer>
  );
};

export default memo(ExploreGridPresenter);
