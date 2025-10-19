import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  setExpandedOpen,
  setExpandedSection,
  updateExpandedHeight,
  setHasUserScrolledAfterExpand,
} from '@redux/grid';
import type { GridItem as GridItemType, ExpandedSection as ExpandedSectionType } from '../../types';
import { GRID_CONFIG } from '../../CONSTANTS';
import { calculateGridDimensions } from '@src/utils/grid';
import ExpandedSection from './expanded-section';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

// Piezas reales (conservadas)
import GridItemCard from '@src/sections/explore/components/grid-item-card';
import type { Post } from '@src/graphql/generated/graphql';
import ExpanderPlayerInfo from '@src/sections/explore/components/explore-expander-info';

import TopPicksSlider from '@src/components/adaptative-slider/variants/top-picks';
import ContinueWatchingSlider from '@src/components/adaptative-slider/variants/continue-watching';
import PopularThisWeekSlider from '@src/components/adaptative-slider/variants/popular-this-week';
import MoreFromComedySlider from '@src/components/adaptative-slider/variants/more-from';
import PopularInRegionSlider from '@src/components/adaptative-slider/variants/popular-in-region';
import ThisCanInterestYouSlider from '@src/components/adaptative-slider/variants/interest';

// ============================================================================
//  Tipos internos
// ============================================================================
type RowType = 'normal' | 'slider' | 'expander';
interface BaseRow { key: string; type: RowType; }
interface NormalRow extends BaseRow { type: 'normal'; cells: GridItemType[]; }
interface SliderRow extends BaseRow {
  type: 'slider';
  slider: GridItemType; // fijo 2x2
  grid: (GridItemType | null | 'slider')[][];
  sliderColStart: number; // 0..(cols-2)
}
interface ExpanderRow extends BaseRow { type: 'expander'; anchorForRowIndex: number; }
type AnyRow = NormalRow | SliderRow | ExpanderRow;

// ============================================================================
//  Estilos
// ============================================================================
const ScrollParent = styled(Box)(() => ({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
}));

const RowsInner = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
}));

const RowBox = styled(Box)<{ $dimmed?: boolean }>(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
  willChange: 'transform,height',
  contain: 'content',
}));

const GridRow = styled(Box)<{
  $gap: number;
  $cols: number;
  $itemSizePx: number;
  $isTwoRows?: boolean;
}>(({ $gap, $cols, $itemSizePx, $isTwoRows }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: `repeat(${$cols}, ${$itemSizePx}px)`,
  gridAutoRows: `${$itemSizePx}px`,
  gridTemplateRows: $isTwoRows ? `repeat(2, ${$itemSizePx}px)` : undefined,
  gap: `${$gap}px`,
  paddingLeft: $gap,
  paddingRight: $gap,
}));

const Cell = styled(Box)(() => ({
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
}));

const SkeletonGrid = memo(
  ({ columns, itemSize, gap }: { columns: number; itemSize: number; gap: number }) => {
    const theme = useTheme();
    const count = Math.max(columns * 6, 1);
    const cardBorder = alpha(theme.palette.common.white, 0.06);
    const chipBg = alpha(theme.palette.common.white, 0.08);

    return (
      <Box sx={{ position: 'absolute', left: gap, right: gap, top: gap }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${itemSize}px)`,
            gridAutoRows: `${itemSize}px`,
            gap: '12px',
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${cardBorder}`,
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  height: '100%',
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                }}
              />

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  right: 12,
                }}
              >
                <Skeleton variant="rounded" width={56} height={18} sx={{ bgcolor: chipBg }} />
                <Skeleton variant="rounded" width={56} height={18} sx={{ bgcolor: chipBg, flexShrink: 0 }} />
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);

// ============================================================================
//  Helpers: sliders e hileras
// ============================================================================
const MIN_GAP_BETWEEN_SLIDERS = 3;

const PLAYER_ASPECT_RATIO = 9 / 16;
const PLAYER_MIN_HEIGHT_XS = 280;
const PLAYER_MIN_HEIGHT_MD = 360;
const EXPANDER_EXTRA_VERTICAL = 12; // margin-bottom from ExpanderPlayerInfo

const estimateExpanderHeight = (width: number, gap: number) => {
  const usableWidth = Math.max(0, width - gap * 2);
  const minHeight = width >= GRID_CONFIG.breakpoints.tablet ? PLAYER_MIN_HEIGHT_MD : PLAYER_MIN_HEIGHT_XS;
  const playerHeight = usableWidth > 0 ? Math.max(usableWidth * PLAYER_ASPECT_RATIO, minHeight) : minHeight;
  return playerHeight + EXPANDER_EXTRA_VERTICAL;
};

const sliderSpacingFromId = (id: string, baseSpacing: number, isMobile: boolean) =>
  isMobile
    ? baseSpacing
    : baseSpacing +
      (Math.abs(
        [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)
      ) %
        3);

const pickSliderColStart = (
  id: string,
  cols: number,
  lastStart: number | null,
  isMobile: boolean
) => {
  if (cols <= 2 || isMobile) return 0;
  const min = 1;
  const max = Math.max(min, cols - 2);
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  let s = min + (Math.abs(h) % (max - min + 1));
  if (lastStart != null && s === lastStart && max > min) {
    s = min + ((s - min + 1) % (max - min + 1));
  }
  return s;
};

function composeVirtualRows(
  items: GridItemType[],
  columns: number,
  isMobile: boolean
) {
  const rows: AnyRow[] = [];
  const itemRowIndex = new Map<string, number>();
  const usedIds = new Set<string>();
  const deferredSliders: GridItemType[] = [];
  const baseSpacing = Math.max(2, isMobile ? 2 : MIN_GAP_BETWEEN_SLIDERS);
  let lastSliderRowIdx = -Infinity;
  let lastSliderColStart: number | null = null;

  const regularQueue: GridItemType[] = [];
  const closeNormalRow = () => {
    const cells = regularQueue.splice(0, columns);
    const rowIdx = rows.length;
    const rowKey = `r:${cells.map((c) => c.id).join('|')}`;
    rows.push({ type: 'normal', key: rowKey, cells });
    cells.forEach((c) => {
      itemRowIndex.set(c.id, rowIdx);
      usedIds.add(c.id);
    });
  };

  const tryPlaceDeferred = (): boolean => {
    if (!deferredSliders.length) return false;
    const s = deferredSliders[0];
    const spacingTarget = sliderSpacingFromId(s.id, baseSpacing, isMobile);
    if (rows.length - lastSliderRowIdx <= spacingTarget) return false;
    const cols = Math.max(2, columns);
    const needed = 2 * cols - 4;
    if (regularQueue.length < needed) return false;

    const grid: (GridItemType | null | 'slider')[][] = [
      Array.from({ length: cols }),
      Array.from({ length: cols }),
    ] as any;
    const sCol = pickSliderColStart(s.id, cols, lastSliderColStart, isMobile);
    lastSliderColStart = sCol;
    grid[0][sCol] = grid[0][sCol + 1] = 'slider';
    grid[1][sCol] = grid[1][sCol + 1] = 'slider';
    const take = () => (regularQueue.length ? regularQueue.shift()! : null);
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < cols; c++) if (!grid[r][c]) grid[r][c] = take();

    const rowIdx = rows.length;
    rows.push({
      type: 'slider',
      key: `s-${s.id}`,
      slider: s,
      grid,
      sliderColStart: sCol,
    });
    itemRowIndex.set(s.id, rowIdx);
    grid.forEach((r) =>
      r.forEach((cell) => {
        if (cell && cell !== 'slider') {
          itemRowIndex.set(cell.id, rowIdx);
          usedIds.add(cell.id);
        }
      })
    );
    lastSliderRowIdx = rowIdx;
    deferredSliders.shift();
    return true;
  };

  let i = 0;
  while (i < items.length) {
    const it = items[i];
    if (it.type === 'regular') {
      if (!usedIds.has(it.id)) {
        regularQueue.push({ ...it, dimensions: { width: 1, height: 1 } });
        const cols = Math.max(2, columns);
        const needed = 2 * cols - 4;
        if (deferredSliders.length) {
          if (regularQueue.length >= needed) {
            const placed = tryPlaceDeferred();
            if (!placed && regularQueue.length >= columns) closeNormalRow();
          }
        } else if (regularQueue.length >= columns) {
          closeNormalRow();
        }
      }
      i++;
      continue;
    }

    // slider
    const spacingTarget = sliderSpacingFromId(it.id, baseSpacing, isMobile);
    const canPlaceSlider = rows.length - lastSliderRowIdx > spacingTarget;
    if (!canPlaceSlider) {
      deferredSliders.push(it);
      i++;
      continue;
    }
    const cols = Math.max(2, columns);
    const grid: (GridItemType | null | 'slider')[][] = [
      Array.from({ length: cols }),
      Array.from({ length: cols }),
    ] as any;
    const sCol = pickSliderColStart(it.id, cols, lastSliderColStart, isMobile);
    lastSliderColStart = sCol;
    grid[0][sCol] = grid[0][sCol + 1] = 'slider';
    grid[1][sCol] = grid[1][sCol + 1] = 'slider';

    const needed = 2 * cols - 4;
    if (regularQueue.length < needed) {
      deferredSliders.push(it);
      i++;
      continue;
    }
    const takeNext = () => regularQueue.shift()!;
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < cols; c++) if (!grid[r][c]) grid[r][c] = takeNext();

    const rowIdx = rows.length;
    rows.push({
      type: 'slider',
      key: `s-${it.id}`,
      slider: it,
      grid,
      sliderColStart: sCol,
    });
    itemRowIndex.set(it.id, rowIdx);
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell && cell !== 'slider') {
          itemRowIndex.set(cell.id, rowIdx);
          usedIds.add(cell.id);
        }
      })
    );
    i++;
  }

  while (true) {
    const cols = Math.max(2, columns);
    const needed = 2 * cols - 4;
    if (deferredSliders.length && regularQueue.length >= needed) {
      if (tryPlaceDeferred()) continue;
    }
    if (regularQueue.length >= columns) {
      closeNormalRow();
      continue;
    }
    break;
  }

  return { rows, itemRowIndex };
}

// ============================================================================
//  Componente principal
// ============================================================================
type VirtualizedGridProps = {
  /** Para mantener tu useInfiniteFeed: el sentinel se pinta al final del contenido */
  sentinelRef?: React.RefObject<HTMLDivElement>;
};

const VirtualizedGrid: React.FC<VirtualizedGridProps> = memo(({ sentinelRef }) => {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.grid.items);
  const expandedSection = useSelector((s: RootState) => s.grid.expandedSection);
  const hasUserScrolledAfterExpand = useSelector(
    (s: RootState) => s.grid.hasUserScrolledAfterExpand
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedSectionRef = useRef<ExpandedSectionType | null>(expandedSection);
  const cleanupTimeoutRef = useRef<number | null>(null);
  const scrollDelayRef = useRef<number | null>(null);
  const expanderRowRef = useRef<HTMLDivElement | null>(null);
  const expanderObserverRef = useRef<ResizeObserver | null>(null);
  const latestExpanderHeightRef = useRef(0);
  const lastMeasuredForMeasureRef = useRef(0);
  const heightUpdateTimeoutRef = useRef<number | null>(null);
  const containerWidthRef = useRef<number>(0);
  const [gridWidth, setGridWidth] = useState(0);

  const resetEstimatedHeight = useCallback(() => {
    latestExpanderHeightRef.current = 0;
    lastMeasuredForMeasureRef.current = 0;
  }, []);

  // Recalcular columnas y tamaño de item según ancho real
  const { columns, itemSize, gap } = useMemo(() => {
    const gridDims = calculateGridDimensions(
      gridWidth || containerWidthRef.current || 0,
      GRID_CONFIG
    );
    return {
      columns: gridDims.columns || 1,
      itemSize: Math.max(1, Math.round(gridDims.itemSize)),
      gap: gridDims.gap,
    };
  }, [gridWidth]);

  useEffect(() => {
    expandedSectionRef.current = expandedSection;
  }, [expandedSection]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.max(0, el.clientWidth);
      containerWidthRef.current = w;
      setGridWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Componer filas
  const { rows: baseRows, itemRowIndex } = useMemo(
    () => composeVirtualRows(items, columns, columns <= 2),
    [items, columns]
  );

  // Inserción del expander
  const rows: AnyRow[] = useMemo(() => {
    if (!expandedSection) return baseRows;
    const targetRowIdx = itemRowIndex.get(expandedSection.itemId);
    if (targetRowIdx == null) return baseRows;
    const cloned = baseRows.slice();
    cloned.splice(targetRowIdx, 0, {
      type: 'expander',
      key: `x-${expandedSection.itemId}`,
      anchorForRowIndex: targetRowIdx,
    } as ExpanderRow);
    return cloned;
  }, [baseRows, expandedSection, itemRowIndex]);

  // Virtualizer
  const estimateSize = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row) return GRID_CONFIG.minItemSize + gap;
      if (row.type === 'normal') return itemSize + gap;
      if (row.type === 'slider') return itemSize * 2 + gap * 2;
      const dynamicHeight = latestExpanderHeightRef.current;
      return Math.max(dynamicHeight, 1) + gap;
    },
    [rows, itemSize, gap]
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    overscan: 8,
    measureElement: (el) => el.getBoundingClientRect().height,
    getItemKey: (index) => rows[index]?.key ?? index,
  });

  // Dim de filas cuando el expander está abierto (hasta que el usuario scrollee)
  const dimAll = !!expandedSection && !hasUserScrolledAfterExpand;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let scrolled = false;
    const onScroll = () => {
      if (dimAll && !scrolled) {
        scrolled = true;
        dispatch(setHasUserScrolledAfterExpand(true));
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [dimAll, dispatch]);

  // Centrar el expander al abrir
  const lastCenterKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!expandedSection || !expandedSection.isOpen) {
      if (scrollDelayRef.current) {
        window.clearTimeout(scrollDelayRef.current);
        scrollDelayRef.current = null;
      }
      lastCenterKeyRef.current = null;
      return;
    }

    const idx = rows.findIndex(
      (r) => r.type === 'expander' && r.key === `x-${expandedSection.itemId}`
    );
    if (idx < 0) return;
    if (expandedSection.height <= 0) return;

    const key = `${expandedSection.itemId}:${expandedSection.height}`;
    if (lastCenterKeyRef.current === key) return;
    lastCenterKeyRef.current = key;

    if (scrollDelayRef.current) window.clearTimeout(scrollDelayRef.current);

    const performScroll = () => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) {
        scrollDelayRef.current = null;
        return;
      }

      const targetVirtualItem = virtualizer
        .getVirtualItems()
        .find((item) => item.key === `x-${expandedSection.itemId}`);

      if (!targetVirtualItem) {
        scrollDelayRef.current = window.setTimeout(performScroll, 24);
        return;
      }

      const rowHeight = expandedSection.height;
      if (rowHeight <= 0) {
        scrollDelayRef.current = window.setTimeout(performScroll, 24);
        return;
      }

      const viewportHeight = scrollEl.clientHeight;
      const desiredOffset =
        targetVirtualItem.start - Math.max((viewportHeight - rowHeight) / 2, 0);
      const maxOffset = Math.max(0, scrollEl.scrollHeight - viewportHeight);
      scrollEl.scrollTo({
        top: Math.max(0, Math.min(desiredOffset, maxOffset)),
        behavior: 'smooth',
      });
      scrollDelayRef.current = null;
    };

    scrollDelayRef.current = window.setTimeout(performScroll, 32);
  }, [expandedSection, rows, virtualizer]);

  useEffect(() => {
    return () => {
      if (scrollDelayRef.current) window.clearTimeout(scrollDelayRef.current);
    };
  }, []);

  // Abrir / cerrar
  const openExpandedForItem = useCallback(
    (item: GridItemType, selectedPost?: Post | null) => {
      const rowIdx = itemRowIndex.get(item.id);
      if (rowIdx == null) return;
      const baseWidth = gridWidth || containerWidthRef.current;
      const predictedHeight = estimateExpanderHeight(baseWidth, gap);
      latestExpanderHeightRef.current = predictedHeight;
      lastMeasuredForMeasureRef.current = predictedHeight;
      dispatch(
        setExpandedSection({
          itemId: item.id,
          isOpen: true,
          anchorRow: rowIdx,
          y: 0,
          height: predictedHeight,
          selectedPost: selectedPost ?? (item.data?.post as Post | undefined) ?? null,
        })
      );
      dispatch(setHasUserScrolledAfterExpand(false));
    },
    [dispatch, itemRowIndex, gap, gridWidth]
  );

  const scheduleExpandedCleanup = useCallback(
    (itemId: string) => {
      if (cleanupTimeoutRef.current !== null) window.clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = window.setTimeout(() => {
        const current = expandedSectionRef.current;
        if (current && current.itemId === itemId && !current.isOpen) {
          dispatch(setExpandedSection(null));
        }
        cleanupTimeoutRef.current = null;
      }, GRID_CONFIG.animationDuration);
    },
    [dispatch]
  );

  const handleItemClick = useCallback(
    (item: GridItemType) => {
      if (expandedSection?.itemId === item.id) {
        resetEstimatedHeight();
        dispatch(setExpandedOpen(false));
        scheduleExpandedCleanup(item.id);
        return;
      }

      if (cleanupTimeoutRef.current !== null) {
        window.clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }

      const itemPost = item.data?.post as Post | undefined;
      if (expandedSection) {
        resetEstimatedHeight();
        openExpandedForItem(item, itemPost);
        return;
      }
      openExpandedForItem(item, itemPost);
    },
    [dispatch, expandedSection, openExpandedForItem, resetEstimatedHeight, scheduleExpandedCleanup]
  );

  const handleSliderPostSelect = useCallback(
    (sliderItem: GridItemType, post: Post | null | undefined) => {
      if (!post) return;
      if (cleanupTimeoutRef.current !== null) {
        window.clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      resetEstimatedHeight();
      openExpandedForItem(sliderItem, post);
    },
    [openExpandedForItem, resetEstimatedHeight]
  );

  const handleCloseExpanded = useCallback(() => {
    if (!expandedSection) return;
    resetEstimatedHeight();
    dispatch(setExpandedOpen(false));
    scheduleExpandedCleanup(expandedSection.itemId);
  }, [dispatch, expandedSection, resetEstimatedHeight, scheduleExpandedCleanup]);

  // Medición del expander y referencia DOM para scroll
  const setExpanderNode = useCallback(
    (el: HTMLDivElement | null) => {
      expanderRowRef.current = el;
      if (expanderObserverRef.current) {
        expanderObserverRef.current.disconnect();
        expanderObserverRef.current = null;
      }
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const h = Math.ceil(entries[0]?.contentRect.height ?? el.offsetHeight);
        if (h >= 0) {
          latestExpanderHeightRef.current = h;
          const prev = lastMeasuredForMeasureRef.current;
          if (Math.abs(h - prev) > 12 || prev === 0) {
            lastMeasuredForMeasureRef.current = h;
            requestAnimationFrame(() => virtualizer.measureElement(el));
          }
          if (heightUpdateTimeoutRef.current) window.clearTimeout(heightUpdateTimeoutRef.current);
          heightUpdateTimeoutRef.current = window.setTimeout(() => {
            dispatch(updateExpandedHeight(latestExpanderHeightRef.current));
            lastMeasuredForMeasureRef.current = latestExpanderHeightRef.current;
            if (expanderRowRef.current) {
              requestAnimationFrame(() => virtualizer.measureElement(expanderRowRef.current!));
            }
            heightUpdateTimeoutRef.current = null;
          }, 120);
        }
      });
      ro.observe(el);
      expanderObserverRef.current = ro;
    },
    [dispatch, virtualizer]
  );

  useEffect(() => {
    return () => {
      if (expanderObserverRef.current) expanderObserverRef.current.disconnect();
      expanderObserverRef.current = null;
      expanderRowRef.current = null;
      if (heightUpdateTimeoutRef.current) window.clearTimeout(heightUpdateTimeoutRef.current);
      heightUpdateTimeoutRef.current = null;
      resetEstimatedHeight();
    };
  }, [resetEstimatedHeight]);

  // Mostrar skeleton si aún no hay filas
  const shouldShowSkeleton = rows.length === 0;

  // ---------- helpers de render ----------
  const renderSliderById = (
    sliderId: string | undefined,
    cell: number,
    gapPx: number,
    onPostSelect?: (post: Post) => void
  ) => {
    const commonProps = { span: { w: 2, h: 2 }, cell, gapPx, onPostSelect };
    switch (sliderId) {
      case 'top-picks':
        return <TopPicksSlider {...commonProps} />;
      case 'continue-watching':
        return <ContinueWatchingSlider {...commonProps} />;
      case 'popular-week':
        return <PopularThisWeekSlider {...commonProps} />;
      case 'comedy':
        return <MoreFromComedySlider {...commonProps} />;
      case 'region':
        return <PopularInRegionSlider {...commonProps} />;
      case 'interest':
        return <ThisCanInterestYouSlider {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <ScrollParent ref={scrollRef}>
      <RowsInner style={{ height: virtualizer.getTotalSize() }}>
        {shouldShowSkeleton ? (
          <SkeletonGrid columns={columns} itemSize={itemSize} gap={gap} />
        ) : (
          virtualizer.getVirtualItems().map((vRow) => {
            const row = rows[vRow.index];
            const y = vRow.start;
            const isExpander = row.type === 'expander';

            return (
              <RowBox
                key={row.key}
                data-index={vRow.index}
                ref={isExpander ? (setExpanderNode as any) : undefined}
                $dimmed={!!expandedSection && !isExpander && !hasUserScrolledAfterExpand}
                sx={{
                  transform: `translateY(${y}px)`,
                  minHeight:
                    row.type === 'expander' && expandedSection && !expandedSection.isOpen
                      ? gap
                      : undefined,
                }}
              >
                {row.type === 'normal' && (
                  <GridRow $gap={gap} $cols={columns} $itemSizePx={itemSize}>
                    {row.cells
                      .concat(
                        Array.from(
                          { length: Math.max(0, columns - row.cells.length) }
                        ) as any
                      )
                      .map((cell: GridItemType | undefined, idx: number) =>
                        cell ? (
                          <Cell key={cell.id}>
                            <GridItemCard
                              post={cell.data?.post as Post}
                              isActive={!!expandedSection && expandedSection.itemId === cell.id}
                              onActivate={() => handleItemClick(cell)}
                            />
                          </Cell>
                        ) : (
                          <Box key={`ph-${idx}`} sx={{ width: itemSize, height: itemSize }} />
                        )
                      )}
                  </GridRow>
                )}

                {row.type === 'slider' && (
                  <GridRow $gap={gap} $cols={columns} $itemSizePx={itemSize} $isTwoRows>
                    {row.grid.map((r, rIdx) =>
                      r.map((cell, cIdx) => {
                        const key = `${rIdx}-${cIdx}`;
                        if (cell === 'slider') {
                          if (rIdx === 0 && cIdx === row.sliderColStart) {
                            const sliderId: string | undefined =
                              (row.slider.data && (row.slider.data as any).sliderId) ||
                              row.slider.id.replace(/^slider-/, '');
                            const sliderElement = renderSliderById(sliderId, itemSize, gap, (post) =>
                              handleSliderPostSelect(row.slider, post)
                            );
                            return (
                              <Cell
                                key={`slider-${row.slider.id}`}
                                sx={{
                                  gridColumn: `${row.sliderColStart + 1} / span 2`,
                                  gridRow: '1 / span 2',
                                }}
                              >
                                {sliderElement}
                              </Cell>
                            );
                          }
                          return null;
                        }
                        if (cell) {
                          return (
                            <Cell key={cell.id} onClick={() => handleItemClick(cell)}>
                              <GridItemCard
                                post={cell.data?.post as Post}
                                isActive={!!expandedSection && expandedSection.itemId === cell.id}
                                onActivate={() => handleItemClick(cell)}
                              />
                            </Cell>
                          );
                        }
                        return <Box key={key} sx={{ width: itemSize, height: itemSize }} />;
                      })
                    )}
                  </GridRow>
                )}

                {row.type === 'expander' && expandedSection && (
                  <Box sx={{ width: '100%' }}>
                    {(() => {
                      const expandedItem = items.find(
                        (it: GridItemType) => it.id === expandedSection.itemId
                      );
                      if (!expandedItem) return null;
                      const fallbackPost = expandedItem?.data?.post as Post | undefined;
                      const resolvedPost =
                        expandedSection.selectedPost ?? fallbackPost ?? null;
                      const expanderChild = resolvedPost ? (
                        <ExpanderPlayerInfo
                          key={`expander-${expandedSection.itemId}-${resolvedPost.id}`}
                          post={resolvedPost}
                        />
                      ) : null;
                      return (
                        <ExpandedSection
                          expandedSection={expandedSection}
                          item={expandedItem}
                          onRequestClose={handleCloseExpanded}
                          animationDuration={GRID_CONFIG.animationDuration}
                          gap={gap}
                        >
                          {expanderChild}
                        </ExpandedSection>
                      );
                    })()}
                  </Box>
                )}
              </RowBox>
            );
          })
        )}

        {/* Sentinel para useInfiniteFeed: cerca del final del contenido virtualizado */}
        {sentinelRef && (
          <Box
            ref={sentinelRef as any}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 1,
              top: Math.max(0, virtualizer.getTotalSize() - itemSize),
            }}
          />
        )}
      </RowsInner>
    </ScrollParent>
  );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';
export default VirtualizedGrid;
