import type { GridItem as GridItemType } from '@src/sections/explore/types';
import type { AnyRow, NormalRow, SliderRow } from '@src/sections/explore/components/grid/row-types';
import {
  MIN_GAP_BETWEEN_SLIDERS,
  SLIDER_SIZE,
  buildSliderGrid,
  sliderSpacingFromId,
  takeFromQueue,
} from './explore-grid-row-helpers';

const closeNormalRow = (
  queue: GridItemType[],
  rows: AnyRow[],
  rowIndexMap: Map<string, number>,
  columns: number,
) => {
  if (!queue.length) return;
  const cells = queue.splice(0, columns);
  const rowIdx = rows.length;
  rows.push({ type: 'normal', key: `r:${cells.map((cell) => cell.id).join('|')}`, cells } satisfies NormalRow);
  cells.forEach((cell) => rowIndexMap.set(cell.id, rowIdx));
};

const placeSliderRow = (
  slider: GridItemType,
  queue: GridItemType[],
  rows: AnyRow[],
  rowIndexMap: Map<string, number>,
  columns: number,
  isMobile: boolean,
  lastSliderColStart: { current: number | null },
  lastSliderRowIdx: { current: number },
) => {
  const { grid, sliderColStart, cols } = buildSliderGrid(slider, columns, isMobile, lastSliderColStart);
  const requiredCells = SLIDER_SIZE * cols - SLIDER_SIZE * SLIDER_SIZE;
  if (queue.length < requiredCells) return false;

  for (let r = 0; r < SLIDER_SIZE; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c]) continue;
      grid[r][c] = takeFromQueue(queue);
    }
  }

  const rowIdx = rows.length;
  rows.push({ type: 'slider', key: `s-${slider.id}`, slider, grid, sliderColStart } satisfies SliderRow);
  rowIndexMap.set(slider.id, rowIdx);
  grid.flat().forEach((cell) => {
    if (cell && cell !== 'slider') rowIndexMap.set(cell.id, rowIdx);
  });
  lastSliderRowIdx.current = rowIdx;
  return true;
};

/**
 * Calculates a deterministic sequence of virtual rows describing how explore
 * items should occupy the grid for the current viewport configuration.
 */
export const composeVirtualRows = (
  items: GridItemType[],
  columns: number,
  isMobile: boolean,
): { rows: AnyRow[]; itemRowIndex: Map<string, number> } => {
  const rows: AnyRow[] = [];
  const itemRowIndex = new Map<string, number>();
  const deferredSliders: GridItemType[] = [];
  const regularQueue: GridItemType[] = [];
  const lastSliderColStart = { current: null as number | null };
  const lastSliderRowIdx = { current: -Infinity };

  const baseSpacing = Math.max(2, isMobile ? 2 : MIN_GAP_BETWEEN_SLIDERS);
  const usedIds = new Set<string>();

  let index = 0;
  while (index < items.length) {
    const current = items[index];
    if (current.type === 'regular') {
      if (!usedIds.has(current.id)) {
        regularQueue.push({ ...current, dimensions: { width: 1, height: 1 } });
      }
      if (deferredSliders.length) {
        if (
          placeSliderRow(
            deferredSliders[0],
            regularQueue,
            rows,
            itemRowIndex,
            columns,
            isMobile,
            lastSliderColStart,
            lastSliderRowIdx,
          )
        ) {
          deferredSliders.shift();
        }
      } else if (regularQueue.length >= columns) {
        closeNormalRow(regularQueue, rows, itemRowIndex, columns);
      }
      index += 1;
      continue;
    }

    const spacingTarget = sliderSpacingFromId(current.id, baseSpacing, isMobile);
    if (rows.length - lastSliderRowIdx.current <= spacingTarget) {
      deferredSliders.push(current);
      index += 1;
      continue;
    }

    if (
      !placeSliderRow(
        current,
        regularQueue,
        rows,
        itemRowIndex,
        columns,
        isMobile,
        lastSliderColStart,
        lastSliderRowIdx,
      )
    ) {
      deferredSliders.push(current);
    }
    index += 1;
  }

  while (regularQueue.length) {
    if (
      deferredSliders.length &&
      placeSliderRow(
        deferredSliders[0],
        regularQueue,
        rows,
        itemRowIndex,
        columns,
        isMobile,
        lastSliderColStart,
        lastSliderRowIdx,
      )
    ) {
      deferredSliders.shift();
      continue;
    }
    closeNormalRow(regularQueue, rows, itemRowIndex, columns);
  }

  return { rows, itemRowIndex };
};
