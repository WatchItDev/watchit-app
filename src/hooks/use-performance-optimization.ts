import { useCallback, useRef, useEffect } from 'react';
import { GridItem } from '@src/sections/explore/types.ts';

interface PerformanceConfig {
  debounceMs: number;
  throttleMs: number;
  maxItemsPerRender: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  debounceMs: 300,
  throttleMs: 16, // ~60fps
  maxItemsPerRender: 100,
};

export const usePerformanceOptimization = (config: PerformanceConfig = DEFAULT_CONFIG) => {
  const { debounceMs, throttleMs, maxItemsPerRender } = config;

  // Refs para throttling y debouncing
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecutionTime = useRef(0);

  // Throttle function
  const throttle = useCallback(<T extends (...args: any[]) => any>(
      func: T,
      delay: number = throttleMs
  ): T => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecutionTime.current >= delay) {
        lastExecutionTime.current = now;
        return func(...args);
      }

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }

      throttleTimeoutRef.current = setTimeout(() => {
        lastExecutionTime.current = Date.now();
        func(...args);
      }, Math.max(0, delay - (now - lastExecutionTime.current)));
    }) as T;
  }, [throttleMs]);

  // Debounce function
  const debounce = useCallback(<T extends (...args: any[]) => any>(
      func: T,
      delay: number = debounceMs
  ): T => {
    return ((...args: Parameters<T>) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    }) as T;
  }, [debounceMs]);

  // Helpers PUROS (no hooks adentro)
  const getVisibleItems = useCallback((
      items: GridItem[],
      visibleItemIds: string[]
  ): GridItem[] => {
    // función pura
    return items.filter(item => visibleItemIds.includes(item.id));
  }, []);

  const getPositions = useCallback((
      items: GridItem[],
      _gridDimensions: any,
      _rowHeights: number[]
  ) => {
    const positions = new Map<string, { x: number; y: number }>();
    items.forEach(item => {
      positions.set(item.id, { x: 0, y: 0 });
    });
    return positions;
  }, []);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // Chunking
  const chunkItems = useCallback((items: GridItem[], chunkSize: number = maxItemsPerRender) => {
    const chunks: GridItem[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
  }, [maxItemsPerRender]);

  // Heurística de rerender
  const shouldRerenderItem = useCallback((
      item: GridItem,
      prevItem: GridItem | undefined,
      // Nota: si quieres comparar dependencias entre renders, pásalas como prev/next
      // o gestiona un ref de prevDeps.
      dependenciesChanged: boolean = false
  ): boolean => {
    if (!prevItem) return true;

    const criticalPropsChanged =
        item.position.x !== prevItem.position.x ||
        item.position.y !== prevItem.position.y ||
        item.color !== prevItem.color ||
        item.dimensions.width !== prevItem.dimensions.width ||
        item.dimensions.height !== prevItem.dimensions.height;

    return criticalPropsChanged || dependenciesChanged;
  }, []);

  return {
    throttle,
    debounce,
    getVisibleItems,
    getPositions,
    chunkItems,
    shouldRerenderItem,
  };
};
