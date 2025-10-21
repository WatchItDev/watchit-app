import { useEffect } from 'react';

interface RuntimeRefs {
  expanderObserverRef: React.MutableRefObject<ResizeObserver | null>;
  cleanupTimeoutRef: React.MutableRefObject<number | null>;
  scrollDelayRef: React.MutableRefObject<number | null>;
  heightUpdateTimeoutRef: React.MutableRefObject<number | null>;
}

/**
 * Ensures observers and timers created by the expander controller are disposed on unmount.
 */
export const useExpanderCleanup = (runtime: RuntimeRefs) => {
  useEffect(
    () => () => {
      if (runtime.expanderObserverRef.current) runtime.expanderObserverRef.current.disconnect();
      if (runtime.cleanupTimeoutRef.current) window.clearTimeout(runtime.cleanupTimeoutRef.current);
      if (runtime.scrollDelayRef.current) window.clearTimeout(runtime.scrollDelayRef.current);
      if (runtime.heightUpdateTimeoutRef.current) window.clearTimeout(runtime.heightUpdateTimeoutRef.current);
    },
    [runtime],
  );
};
