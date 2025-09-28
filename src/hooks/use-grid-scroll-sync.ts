import { useEffect, useRef } from 'react';
import { usePerformanceOptimization } from '@src/hooks/use-performance-optimization.ts';
import type { GridScrollSyncHandlers } from '@src/sections/explore/types';

/**
 * Synchronises scroll state with the Redux store to support header and UI cues.
 */
export const useGridScrollSync = ({ setScrollPosition, setIsScrolling }: GridScrollSyncHandlers) => {
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { throttle } = usePerformanceOptimization();

  useEffect(() => {
    const handleScroll = () => {
      const throttled = throttle(() => {
        setScrollPosition(window.scrollY);
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      }, 16);
      throttled();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [setIsScrolling, setScrollPosition, throttle]);
};
