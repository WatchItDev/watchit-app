import { useEffect, useRef, useState } from 'react';

/**
 * Enables layout transitions after the initial render stabilises.
 */
export const useGridTransitions = (columns: number, harmonizedCount: number) => {
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const firstReadyRef = useRef(false);

  useEffect(() => {
    if (!columns) return;
    if (!harmonizedCount) return;
    if (firstReadyRef.current) return;

    const id = requestAnimationFrame(() => {
      setTransitionsEnabled(true);
      firstReadyRef.current = true;
    });

    return () => cancelAnimationFrame(id);
  }, [columns, harmonizedCount]);

  return transitionsEnabled;
};
