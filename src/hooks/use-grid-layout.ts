import { useEffect, useMemo, useRef } from 'react';
import type {
  GridDimensions,
  GridItem,
  UseGridLayoutResult,
} from '@src/sections/explore/types';
import {
  adaptItemsToColumns,
  calculateRowHeights,
  generateHarmoniousLayout,
} from '@src/utils/grid';

/**
 * Drives the item layout harmonisation lifecycle of the explore grid.
 */
export const useGridLayout = (
  items: GridItem[],
  gridDimensions: GridDimensions,
): UseGridLayoutResult => {
  const prevLayoutRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const prevColsRef = useRef<number>(gridDimensions.columns);

  useEffect(() => {
    if (prevColsRef.current !== gridDimensions.columns) {
      prevLayoutRef.current = new Map();
      prevColsRef.current = gridDimensions.columns;
    }
  }, [gridDimensions.columns]);

  const responsiveItems = useMemo(() => {
    if (!gridDimensions.columns || items.length === 0) return [] as GridItem[];
    return adaptItemsToColumns(items, gridDimensions);
  }, [items, gridDimensions]);

  const { harmonizedItems, rowHeights } = useMemo(() => {
    if (!gridDimensions.columns || responsiveItems.length === 0) {
      return { rowHeights: [] as number[], harmonizedItems: [] as GridItem[] };
    }

    const isMobile = gridDimensions.columns <= 2;
    const result = generateHarmoniousLayout(responsiveItems, gridDimensions, {
      prevPositions: prevLayoutRef.current,
      minSliderRowGap: isMobile ? 2 : 3,
      maxSliderRowGap: isMobile ? 4 : 6,
    });

    const heights = calculateRowHeights(result.items, gridDimensions);
    const nextMap = new Map<string, { x: number; y: number }>();
    result.items.forEach((item) => nextMap.set(item.id, { ...item.position }));
    prevLayoutRef.current = nextMap;

    return { rowHeights: heights, harmonizedItems: result.items };
  }, [responsiveItems, gridDimensions]);

  return { harmonizedItems, rowHeights };
};
