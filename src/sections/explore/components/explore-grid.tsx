import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  setGridDimensions,
  setExpandedSection,
  setScrollPosition,
  setIsScrolling,
  setExpandedOpen,
  updateExpandedY,
  updateExpandedHeight,
  addItems,
  resetGrid,
} from '@redux/grid';
import { type GridItem as GridItemType } from '../types';
import { GRID_CONFIG } from '../CONSTANTS.ts';
import {
  calculateGridDimensions,
  calculateRowHeights,
  calculateExpandedSectionPosition,
  generateHarmoniousLayout,
  adaptItemsToColumns,
  getTopOfRow,
} from '@src/utils/grid.ts';
import { usePerformanceOptimization } from '@src/hooks/use-performance-optimization.ts';
import { useInfiniteFeed } from '@src/hooks/use-infinite-feed';
import type { Post } from '@src/graphql/generated/graphql';
import ExploreItem from './explore-item';
import ExploreExpandedInline from './explore-expanded-inline';
import TopPicksSlider from '@src/components/adaptative-slider/variants/top-picks';
import ContinueWatchingSlider from '@src/components/adaptative-slider/variants/continue-watching';
import PopularThisWeekSlider from '@src/components/adaptative-slider/variants/popular-this-week';
import MoreFromComedySlider from '@src/components/adaptative-slider/variants/more-from';
import PopularInRegionSlider from '@src/components/adaptative-slider/variants/popular-in-region';
import ThisCanInterestYouSlider from '@src/components/adaptative-slider/variants/interest';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store.ts';

const GridContainer = styled(Box)(({}) => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  overflow: 'hidden',
}));

const GridWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  padding: theme.spacing(2),
}));

const LoadingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const SkeletonGrid: React.FC<{ columns: number; itemSize: number; gap: number; rows?: number; }>
  = ({ columns, itemSize, gap, rows = 6 }) => {
  const count = Math.max(1, columns * rows);
  return (
    <Box sx={{ position: 'absolute', left: gap, right: gap, top: gap }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px` }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={itemSize} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    </Box>
  );
};

// ---- Sliders programados ----
const SLIDERS = [
  { id: 'top-picks',         after: 3,  w: 2, h: 2, render: (cell: number) => <TopPicksSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
  { id: 'continue-watching', after: 12, w: 2, h: 2, render: (cell: number) => <ContinueWatchingSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
  { id: 'popular-week',      after: 22, w: 2, h: 2, render: (cell: number) => <PopularThisWeekSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
  { id: 'comedy',            after: 35, w: 2, h: 2, render: (cell: number) => <MoreFromComedySlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
  { id: 'region',            after: 48, w: 2, h: 2, render: (cell: number) => <PopularInRegionSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
  { id: 'interest',          after: 60, w: 2, h: 2, render: (cell: number) => <ThisCanInterestYouSlider span={{ w: 2, h: 2 }} cell={cell} gapPx={12} /> },
];

// --- util: duplicar posts para rellenar ---
function repeatUntil<T>(arr: T[], min: number): T[] {
  if (arr.length === 0) return [];
  if (arr.length >= min) return arr.slice(0, min);
  const out: T[] = [];
  let i = 0;
  while (out.length < min) {
    out.push(arr[i % arr.length]);
    i++;
  }
  return out;
}

// posts -> grid items (inyecta sliders una vez)
function postsToGridItems(posts: Post[], minRegularCount = 120): GridItemType[] {
  const basePosts = repeatUntil(posts, Math.max(minRegularCount, posts.length));
  const items: GridItemType[] = [];
  let si = 0;
  const sliders = [...SLIDERS].sort((a, b) => a.after - b.after);

  basePosts.forEach((post, i) => {
    items.push({
      id: `post-${post.id}#${i}`,
      type: 'regular',
      color: '#000',
      title: post.title ?? '',
      dimensions: { width: 1, height: 1 },
      position: { x: 0, y: 0 },
      data: { post },
    });
    while (si < sliders.length && sliders[si].after === i) {
      const s = sliders[si++];
      items.push({
        id: `slider-${s.id}`,
        type: 'slider',
        color: 'transparent',
        title: s.id,
        dimensions: { width: s.w, height: s.h },
        position: { x: 0, y: 0 },
        data: { sliderId: s.id },
      });
    }
  });
  while (si < sliders.length) {
    const s = sliders[si++];
    items.push({
      id: `slider-${s.id}`,
      type: 'slider',
      color: 'transparent',
      title: s.id,
      dimensions: { width: s.w, height: s.h },
      position: { x: 0, y: 0 },
      data: { sliderId: s.id },
    });
  }
  return items;
}

type DynamicProps = {
  externalLoading?: boolean;
  /** 🔑 Sentinel del hook (lo colocamos dentro del grid, al final de los REGULARES) */
  sentinelRef?: React.RefObject<HTMLDivElement>;
};

const DynamicGridExplore: React.FC<DynamicProps> = memo(({ externalLoading = false, sentinelRef }) => {
  const dispatch = useDispatch();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const items = useSelector((s: RootState) => s.grid.items);
  const expandedSection = useSelector((s: RootState) => s.grid.expandedSection);
  const gridDimensions = useSelector((s: RootState) => s.grid.gridDimensions);
  const { throttle: throttler } = usePerformanceOptimization();

  const prevLayoutRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const prevColsRef = useRef<number>(gridDimensions.columns);
  const [, setContainerWidth] = useState(0);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const firstReadyRef = useRef(false);
  const pendingOpenRef = useRef<GridItemType | null>(null);
  const centerOnceKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0;
      if (gridWrapperRef.current) width = gridWrapperRef.current.clientWidth;
      else if (gridContainerRef.current) width = gridContainerRef.current.clientWidth;
      setContainerWidth(width);
      const dims = calculateGridDimensions(width, GRID_CONFIG);
      dispatch(setGridDimensions(dims));
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [dispatch]);

  useEffect(() => {
    if (prevColsRef.current !== gridDimensions.columns) {
      prevLayoutRef.current = new Map();
      prevColsRef.current = gridDimensions.columns;
    }
  }, [gridDimensions.columns]);

  const responsiveItems = useMemo(() => {
    if (!gridDimensions.columns || items.length === 0) return [] as GridItemType[];
    return adaptItemsToColumns(items, gridDimensions);
  }, [items, gridDimensions.columns, gridDimensions]);

  const { rowHeights, harmonizedItems } = useMemo(() => {
    if (!gridDimensions.columns || responsiveItems.length === 0) {
      return { rowHeights: [] as number[], harmonizedItems: [] as GridItemType[] };
    }
    const isMobile = gridDimensions.columns <= 2;
    const result = generateHarmoniousLayout(responsiveItems, gridDimensions, {
      prevPositions: prevLayoutRef.current,
      minSliderRowGap: isMobile ? 2 : 3,
      maxSliderRowGap: isMobile ? 4 : 6,
    });
    const heights = calculateRowHeights(result.items, gridDimensions);
    const nextMap = new Map<string, { x: number; y: number }>();
    result.items.forEach((it) => nextMap.set(it.id, { ...it.position }));
    prevLayoutRef.current = nextMap;
    return { rowHeights: heights, harmonizedItems: result.items };
  }, [responsiveItems, gridDimensions]);

  useEffect(() => {
    if (!gridDimensions.columns) return;
    if (harmonizedItems.length === 0) return;
    if (firstReadyRef.current) return;
    requestAnimationFrame(() => {
      setTransitionsEnabled(true);
      firstReadyRef.current = true;
    });
  }, [gridDimensions.columns, harmonizedItems.length]);

  const baseTotalGridHeight = useMemo(() => {
    if (rowHeights.length === 0) return 0;
    return rowHeights.length * gridDimensions.itemSize + (rowHeights.length + 1) * gridDimensions.gap;
  }, [rowHeights.length, gridDimensions.itemSize, gridDimensions.gap]);

  const feedHeight = useMemo(() => {
    const regulars = harmonizedItems.filter((it) => it.type === 'regular');
    if (regulars.length === 0) return 0;
    const bottomRow = regulars.reduce((max, it) => Math.max(max, it.position.y + it.dimensions.height), 0);
    return bottomRow * gridDimensions.itemSize + (bottomRow + 1) * gridDimensions.gap;
  }, [harmonizedItems, gridDimensions.itemSize, gridDimensions.gap]);

  const openExpandedForItem = useCallback((item: GridItemType) => {
    const { anchorRow, y } = calculateExpandedSectionPosition(item, harmonizedItems, gridDimensions);
    dispatch(setExpandedSection({
      itemId: item.id,
      isOpen: true,
      anchorRow,
      y,
      height: GRID_CONFIG.expandedEstimatedHeight ?? 360,
      content: undefined,
    }));
    centerOnceKeyRef.current = null;
  }, [dispatch, harmonizedItems, gridDimensions]);

  const handleItemClick = useCallback((item: GridItemType) => {
    if (item.type === 'slider') return;
    if (expandedSection?.itemId === item.id) {
      dispatch(setExpandedOpen(false));
      pendingOpenRef.current = null;
      return;
    }
    if (expandedSection) {
      pendingOpenRef.current = item;
      dispatch(setExpandedOpen(false));
      return;
    }
    openExpandedForItem(item);
  }, [dispatch, expandedSection, openExpandedForItem]);

  useEffect(() => {
    if (!expandedSection) return;
    if (expandedSection.isOpen) return;
    const id = window.setTimeout(() => {
      const next = pendingOpenRef.current;
      dispatch(setExpandedSection(null));
      if (next) {
        openExpandedForItem(next);
        pendingOpenRef.current = null;
      }
    }, GRID_CONFIG.animationDuration);
    return () => clearTimeout(id);
  }, [expandedSection?.isOpen, dispatch, openExpandedForItem]);

  useEffect(() => {
    if (!expandedSection) return;
    const y = getTopOfRow(expandedSection.anchorRow, gridDimensions);
    dispatch(updateExpandedY(y));
  }, [dispatch, gridDimensions.itemSize, gridDimensions.gap, gridDimensions.columns, expandedSection]);

  const handleScroll = useCallback(() => {
    const throttled = throttler(() => {
      dispatch(setScrollPosition(window.scrollY));
      dispatch(setIsScrolling(true));
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => dispatch(setIsScrolling(false)), 150);
    }, 16);
    throttled();
  }, [dispatch, throttler]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  const isItemDimmed = useCallback((_id: string) => false, []);

  const expandedExtraOffset = expandedSection
    ? Math.max(expandedSection.height, GRID_CONFIG.expandedEstimatedHeight ?? 0) + gridDimensions.gap
    : 0;

  useEffect(() => {
    if (!expandedSection?.isOpen) return;
    const key = `${expandedSection.itemId}:${expandedSection.height}`;
    if (centerOnceKeyRef.current === key) return;
    if (expandedSection.height <= 0) return;
    centerOnceKeyRef.current = key;
    const target = expandedSection.y + expandedSection.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [expandedSection?.isOpen, expandedSection?.height, expandedSection?.y, expandedSection?.itemId]);

  const renderGridItems = () =>
    harmonizedItems.map((item) => {
      if (item.type === 'slider') {
        const meta = SLIDERS.find(s => `slider-${s.id}` === item.id);
        const cell = gridDimensions.itemSize;
        const baseX = gridDimensions.gap + item.position.x * (gridDimensions.itemSize + gridDimensions.gap);
        const baseY = gridDimensions.gap + item.position.y * (gridDimensions.itemSize + gridDimensions.gap);
        const needsOffset = expandedSection && item.position.y >= expandedSection.anchorRow;
        const y = needsOffset ? baseY + expandedExtraOffset : baseY;

        const wpx = item.dimensions.width * gridDimensions.itemSize + (item.dimensions.width - 1) * gridDimensions.gap;
        const hpx = item.dimensions.height * gridDimensions.itemSize + (item.dimensions.height - 1) * gridDimensions.gap;

        return (
          <Box
            key={item.id}
            sx={{
              position: 'absolute',
              left: baseX,
              top: y,
              width: wpx,
              height: hpx,
              transition: transitionsEnabled
                ? `top ${GRID_CONFIG.animationDuration}ms cubic-bezier(0.4,0,0.2,1),
                   left ${GRID_CONFIG.animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
                : 'none',
              willChange: 'top,left',
            }}
          >
            {meta?.render ? meta.render(cell) : null}
          </Box>
        );
      }

      return (
        <ExploreItem
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
    });

  const renderExpandedInlineRow = () => {
    if (!expandedSection) return null;
    const expandedItem = harmonizedItems.find((it) => it.id === expandedSection.itemId);
    if (!expandedItem) return null;
    const post = expandedItem?.data?.post as Post | undefined;

    return (
      <ExploreExpandedInline
        top={expandedSection.y}
        open={expandedSection.isOpen}
        animationMs={GRID_CONFIG.animationDuration}
        onMeasured={(h) => dispatch(updateExpandedHeight(h))}
        post={post}
      />
    );
  };

  const baseHeight = baseTotalGridHeight + expandedExtraOffset;

  if (!gridDimensions.columns) {
    return (
      <GridContainer ref={gridContainerRef}>
        <LoadingIndicator>Cargando grid...</LoadingIndicator>
      </GridContainer>
    );
  }

  const skeletonHeight = 6 * gridDimensions.itemSize + 7 * gridDimensions.gap;
  const shouldShowInitialSkeleton = harmonizedItems.length === 0 && externalLoading;

  return (
    <GridContainer ref={gridContainerRef}>
      <GridWrapper ref={gridWrapperRef} style={{ height: shouldShowInitialSkeleton ? skeletonHeight : baseHeight }}>
        {shouldShowInitialSkeleton ? (
          <SkeletonGrid
            columns={gridDimensions.columns}
            itemSize={gridDimensions.itemSize}
            gap={gridDimensions.gap}
            rows={6}
          />
        ) : (
          <>
            {renderGridItems()}
            {renderExpandedInlineRow()}

            {sentinelRef && (
              <Box
                ref={sentinelRef as any}
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
});

export default function ExploreGrid() {
  const dispatch = useDispatch();
  const { items: posts, loading, sentinelRef } = useInfiniteFeed(30);

  useEffect(() => {
    dispatch(resetGrid());
  }, [dispatch]);

  useEffect(() => {
    if (!posts?.length) return;
    const next = postsToGridItems(posts, 120);
    dispatch(addItems(next));
  }, [posts, dispatch]);

  return (
    <Box sx={{ p: 2 }}>
      <DynamicGridExplore externalLoading={loading} sentinelRef={sentinelRef} />
    </Box>
  );
}
