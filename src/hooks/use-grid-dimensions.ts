import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateGridDimensions } from '@src/utils/grid';
import type { GridConfig } from '@src/sections/explore/types';

/**
 * Keeps track of the grid dimensions derived from the container width.
 */
interface UseGridDimensionsArgs {
  scrollRef: React.RefObject<HTMLDivElement>;
  config: GridConfig;
}

/**
 * Observes the scroll container and derives the current column count and cell dimensions.
 */
export const useGridDimensions = ({ scrollRef, config }: UseGridDimensionsArgs) => {
  const containerWidthRef = useRef(0);
  const [gridWidth, setGridWidth] = useState(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const measure = () => {
      const width = Math.max(0, node.clientWidth);
      containerWidthRef.current = width;
      setGridWidth(width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollRef]);

  const dimensions = useMemo(() => {
    const dims = calculateGridDimensions(gridWidth || containerWidthRef.current || 0, config);
    return {
      columns: dims.columns || 1,
      itemSize: Math.max(1, Math.round(dims.itemSize)),
      gap: dims.gap,
      gridWidth,
      containerWidthRef,
    };
  }, [gridWidth, config]);

  return dimensions;
};
