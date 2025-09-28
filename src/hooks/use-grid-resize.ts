import { useEffect, useRef, useState } from 'react';
import { GRID_CONFIG } from '@src/sections/explore/CONSTANTS';
import type { GridDimensions, UseGridResizeResult } from '@src/sections/explore/types';
import { calculateGridDimensions } from '@src/utils/grid';

/**
 * Keeps the grid dimensions in sync with the available viewport space.
 */
export const useGridResize = (setGridDimensions: (dims: GridDimensions) => void): UseGridResizeResult => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0;
      if (gridWrapperRef.current) width = gridWrapperRef.current.clientWidth;
      else if (gridContainerRef.current) width = gridContainerRef.current.clientWidth;
      setContainerWidth(width);
      const dims = calculateGridDimensions(width, GRID_CONFIG);
      setGridDimensions(dims);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [setGridDimensions]);

  return { gridContainerRef, gridWrapperRef };
};
